import { Inject, Injectable, Scope, UnauthorizedException } from '@nestjs/common';
import Redis from 'ioredis';
import { IAuthModuleOptions } from './interfaces/auth-module-options.interface';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IRefreshTokenMeta, ITokenPayload } from './interfaces/tokens.interface';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { getEnvVariable } from '@common/utilities/functions';

/**
 * AuthTokenService handles the creation and management of access and refresh tokens.
 * It uses Redis for refresh token storage and associates them with user metadata.
 */
@Injectable({ scope: Scope.REQUEST })
export class AuthTokenService {
	/**
	 * Returns the TTL (Time To Live) in seconds for refresh tokens.
	 * Defaults to 7 days if not specified in configuration.
	 */
	private get REFRESH_TTL(): number {
		return this.authOptions.refreshTokenTimeToLive || 60 * 60 * 24 * 7;
	}

	constructor(
		@Inject('REDIS_CONNECTION') private readonly redisService: Redis,
		@Inject('AUTH_OPTIONS') private readonly authOptions: IAuthModuleOptions,
		@Inject(REQUEST) private request: Request,
		private readonly jwtService: JwtService,
	) {}

	/**
	 * Constructs the Redis key for a specific refresh token using user ID and JWT ID.
	 * @param {string} userId - The user's unique identifier.
	 * @param {string} jti - The JWT ID.
	 * @returns {string} - A string Redis key.
	 */
	private getRefreshKey(userId: string, jti: string): string {
		return `auth:token:${userId}:${jti}`;
	}

	/**
	 * Constructs the Redis key for a specific access token using the JWT ID.
	 * @param {string} jti - The JWT ID.
	 * @returns {string} - A string Redis key.
	 */
	private getAccessKey(jti: string): string {
		return `auth:access:${jti}`;
	}

	/**
	 * Constructs the Redis key representing all token IDs associated with a user.
	 * @param {string} userId - The user's unique identifier.
	 * @returns {string} - A string Redis key.
	 */
	private getUserTokensKey(userId: string): string {
		return `auth:tokens:${userId}`;
	}

	/**
	 * Generates access and refresh JWT tokens for a given user, hashes the refresh token,
	 * and stores its metadata in Redis for future validation and management.
	 *
	 * @param {string} userId - The ID of the user for whom the tokens are being generated.
	 * @param {string} app - The app identifier (used as issuer or audience).
	 * @param {string} secret - The secret key used to sign the tokens.
	 * @returns {Promise<{ accessToken: string; refreshToken: string }>} A promise resolving to an object containing the access and refresh tokens.
	 */
	async generateTokens(
		userId: string,
		app: string,
		secret: string,
	): Promise<{ accessToken: string; refreshToken: string }> {
		const jti = uuidv4(); // Unique token identifier

		// Payload embedded in the JWTs
		const payload: ITokenPayload = { sub: userId, jti, app };

		// Generate signed access token
		const accessToken = this.jwtService.sign(payload, {
			expiresIn: this.authOptions.accessTokenExpiresIn,
			secret,
		});

		// Generate signed refresh token
		const refreshToken = this.jwtService.sign(payload, {
			expiresIn: this.authOptions.refreshTokenExpiresIn,
			secret,
		});

		// Hash the refresh token for secure storage
		const hashedToken = await bcrypt.hash(refreshToken, 10);

		// Redis key for storing the token metadata
		const key = this.getRefreshKey(userId, jti);

		// Metadata to associate with the refresh token
		const value: IRefreshTokenMeta = {
			hashedToken,
			createdAt: Date.now(),
			userAgent: this.request.headers['user-agent'],
			ip: this.request.ip,
		};

		// Store metadata in Redis with expiry
		await this.redisService.set(key, JSON.stringify(value), 'EX', this.REFRESH_TTL);

		// Add the token ID (jti) to a Redis set tracking all tokens for this user
		await this.redisService.sadd(this.getUserTokensKey(userId), jti);

		// Return the signed tokens to the caller
		return { accessToken, refreshToken };
	}

	/**
	 * Validates the provided access token payload by checking whether it has been revoked.
	 *
	 * @param {ITokenPayload} payload - The JWT payload containing token metadata.
	 * @returns {Promise<{ userId: string; app: string }>} - An object containing the user ID and application if the token is valid.
	 * @throws UnauthorizedException if the token has been marked as revoked in Redis.
	 */
	async validateAccessToken(payload: ITokenPayload): Promise<{ userId: string; app: string }> {
		// Check Redis to see if the token's unique identifier (jti) exists in the revoked token store.
		// Presence in Redis indicates the token was explicitly invalidated (e.g., user logout or admin revocation).
		const isRevoked = await this.redisService.exists(this.getAccessKey(payload.jti));

		if (isRevoked) {
			// A revoked token should not grant access.
			throw new UnauthorizedException('Access token revoked');
		}

		// Token is valid and not revoked.
		return { userId: payload.sub, app: payload.app };
	}

	/**
	 * Verifies the validity of a JWT access token and extracts the associated user ID.
	 *
	 * This method uses a secret key (specific to the app) to verify the token's authenticity.
	 * It then validates the decoded payload to ensure required claims are present, and confirms
	 * the token is still active (not revoked or expired) via `validateAccessToken`.
	 *
	 * @param {Promise<ITokenPayload>} token - The JWT access token to verify.
	 * @param {Promise<ITokenPayload>} app - The name of the application (used to retrieve the appropriate JWT secret).
	 * @returns {Promise<ITokenPayload>} - A promise that resolves to the user ID if the token is valid.
	 * @throws {UnauthorizedException} If the token is invalid, malformed, or missing required fields.
	 */
	async verifyAccessToken(token: string, app: string): Promise<ITokenPayload> {
		// Retrieve the JWT secret specific to the application from environment variables
		const jwtSecret = getEnvVariable(`${app.toUpperCase()}_JWT_SECRET`);

		let payload: ITokenPayload;

		try {
			// Attempt to verify the JWT using the provided secret
			payload = this.jwtService.verify(token, {
				secret: jwtSecret,
			});

			// Ensure the payload is an object and contains the required fields: `sub` and `jti`
			if (typeof payload !== 'object' || !('sub' in payload && 'jti' in payload)) {
				throw new UnauthorizedException('Invalid access token');
			}
		} catch {
			// Catch verification errors and rethrow as an UnauthorizedException
			throw new UnauthorizedException('Invalid access token');
		}

		// Perform additional validation, such as checking for revocation or expiration
		await this.validateAccessToken(payload);

		// Return the validated payload
		return payload;
	}
}
