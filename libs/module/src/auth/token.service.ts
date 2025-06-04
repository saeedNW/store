import { Inject, Injectable, Scope } from '@nestjs/common';
import Redis from 'ioredis';
import { IAuthModuleOptions } from './interfaces/auth-module-options.interface';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IRefreshTokenMeta, ITokenPayload } from './interfaces/tokens.interface';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

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
}
