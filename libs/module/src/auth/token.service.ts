import {
	BadRequestException,
	Inject,
	Injectable,
	NotFoundException,
	Scope,
	UnauthorizedException,
} from '@nestjs/common';
import Redis from 'ioredis';
import { IAuthModuleOptions } from './interfaces/auth-module-options.interface';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { IRefreshTokenMeta, ITokenPayload } from './interfaces/tokens.interface';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { getEnvVariable } from '@common/utilities/functions';
import { jwtVerify, SignJWT, decodeJwt } from 'jose';
import { EncryptionService } from '@modules/encryption';
import { EUserApp } from '@common/enums';
import { Ed25519KeyService } from './keys.service';

/**
 * AuthTokenService handles the creation and management of access and refresh tokens.
 * It uses Redis for refresh token storage and associates them with user metadata.
 */
@Injectable({ scope: Scope.REQUEST })
export class AuthTokenService {
	constructor(
		@Inject('REDIS_CONNECTION') private readonly redisService: Redis,
		@Inject('AUTH_OPTIONS') private readonly authOptions: IAuthModuleOptions,
		@Inject(REQUEST) private request: Request,
		private readonly encryptionService: EncryptionService,
		private readonly keysService: Ed25519KeyService,
	) {}

	/**
	 * The algorithm used for signing and verifying JWT tokens.
	 */
	private readonly algorithm = getEnvVariable('TOKEN_SIGNING_ALGORITHM');

	/**
	 * Returns the TTL (Time To Live) in seconds for refresh tokens.
	 * Defaults to 7 days if not specified in configuration.
	 * @returns {number} - The TTL (Time To Live) in seconds for refresh tokens.
	 */
	private get REFRESH_TTL(): number {
		return this.authOptions.refreshTokenTimeToLive || 60 * 60 * 24 * 7;
	}

	/**
	 * Returns the TTL (Time To Live) in seconds for access tokens.
	 * Default to 15 minutes if not specified in configuration.
	 * @returns {number} - The TTL (Time To Live) in seconds for access tokens.
	 */
	private get ACCESS_TTL(): number {
		return this.authOptions.accessTokenTimeToLive || 60 * 15;
	}

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
	 * @param {EUserApp} app - The app identifier (used as issuer or audience).
	 * @returns {Promise<{ accessToken: string; refreshToken: string }>}
	 * A promise resolving to an object containing the access and refresh tokens.
	 */
	async generateTokens(
		userId: string,
		app: EUserApp,
	): Promise<{ accessToken: string; refreshToken: string }> {
		const jti = uuidv4(); // Unique token identifier

		// Payload embedded in the JWTs
		const payload: ITokenPayload = { sub: userId, jti, app };

		// Generate signed access token
		let accessToken = await new SignJWT({ ...payload })
			.setProtectedHeader({ alg: this.algorithm })
			.setIssuedAt()
			.setExpirationTime(this.authOptions.accessTokenExpiresIn)
			.sign(await this.keysService.getPrivateKey(app, 'access'));

		let refreshToken = await new SignJWT({ ...payload })
			.setProtectedHeader({ alg: this.algorithm })
			.setIssuedAt()
			.setExpirationTime(this.authOptions.refreshTokenExpiresIn)
			.sign(await this.keysService.getPrivateKey(app, 'refresh'));

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

		// Encrypt the tokens for secure transmission
		accessToken = this.encryptionService.encrypt(accessToken, app);
		refreshToken = this.encryptionService.encrypt(refreshToken, app);

		// Return the signed tokens to the caller
		return { accessToken, refreshToken };
	}

	/**
	 * Validates the provided access token payload by checking whether it has been revoked.
	 *
	 * @param {ITokenPayload} payload - The JWT payload containing token metadata.
	 * @returns {Promise<{ userId: string; app: string }>} - An object containing the user ID and application if the token is valid.
	 * @throws {UnauthorizedException} - If the token has been marked as revoked in Redis.
	 */
	async validateAccessToken(payload: ITokenPayload): Promise<{ userId: string; app: string }> {
		// Check Redis to see if the token's unique identifier (jti) exists in the revoked token store.
		// Presence in Redis indicates the token was explicitly invalidated (e.g., user logout or admin revocation).
		const isRevoked = await this.redisService.exists(this.getAccessKey(payload.jti));

		if (isRevoked) {
			// A revoked token should not grant access.
			throw new UnauthorizedException('Access token revoked');
		}

		// Check if a valid refresh session exists for the user and the given token identifier (jti).
		// This ensures the access token is still linked to an active session and has not expired due
		// to inactivity or revocation.
		const hasMatchingRefreshSession = await this.redisService.exists(
			this.getRefreshKey(payload.sub, payload.jti),
		);

		if (!hasMatchingRefreshSession) {
			// A token with no active session should not grant access.
			throw new UnauthorizedException('Access token expired');
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
	 * @param {ITokenPayload} token - The JWT access token to verify.
	 * @returns {Promise<ITokenPayload>} - A promise that resolves to the user ID if the token is valid.
	 * @throws {UnauthorizedException} - If the token is invalid, malformed, or missing required fields.
	 */
	async verifyAccessToken(token: string): Promise<ITokenPayload> {
		// Decode and verify the access token using the app-specific secret
		const { decoded: payload } = await this.verifyToken(
			token,
			await this.keysService.getPublicKey(this.authOptions.issuer, 'access'), // Pass the public key for JWT verification
		);

		// Perform additional validation, such as checking for revocation or expiration
		await this.validateAccessToken(payload);

		// Return the validated payload
		return payload;
	}

	/**
	 * Verifies the validity of a refresh token for a given application.
	 *
	 * This method first decodes and verifies the refresh token using the application's secret.
	 * It then checks Redis for the stored metadata associated with the token's subject (`sub`)
	 * and unique identifier (`jti`). The provided token is compared against the stored hashed token.
	 *
	 * @param {string} token - The JWT refresh token to verify.
	 * @returns {Promise<ITokenPayload>} - A promise that resolves to the decoded token payload if verification succeeds.
	 * @throws {UnauthorizedException} - If the token is invalid, not found in Redis, or does not match the stored hash.
	 */
	async verifyRefreshToken(token: string): Promise<ITokenPayload> {
		// Decode and verify the refresh token using the app-specific secret
		const { decoded, decryptedToken } = await this.verifyToken(
			token,
			await this.keysService.getPublicKey(this.authOptions.issuer, 'refresh'),
		);

		// Construct the Redis key using the subject (user ID) and token identifier (jti)
		const key = this.getRefreshKey(decoded.sub, decoded.jti);

		// Retrieve the stored token metadata from Redis
		const stored = await this.redisService.get(key);
		if (!stored) {
			// If no metadata is found, the token is considered invalid or expired
			throw new UnauthorizedException('Invalid refresh token');
		}

		// Extract the hashed version of the refresh token from stored metadata
		const { hashedToken } = JSON.parse(stored) as IRefreshTokenMeta;

		// Compare the provided token with the stored hashed version
		const isValid = await bcrypt.compare(decryptedToken, hashedToken);
		if (!isValid) {
			// If the token does not match the hash, it is considered invalid
			throw new UnauthorizedException('Invalid refresh token');
		}

		// If all checks pass, return the decoded token payload
		return decoded;
	}

	/**
	 * Revokes a specific refresh token by deleting it from Redis.
	 *
	 * This method removes:
	 * 1. The refresh token metadata associated with the given user and token ID (`jti`).
	 * 2. The token ID from the user's list of active refresh tokens.
	 *
	 * @param {string} userId - The ID of the user whose refresh token is being revoked.
	 * @param {string} jti - The unique identifier (JWT ID) of the refresh token to revoke.
	 * @returns {Promise<void>} - A promise that resolves when the token has been removed from Redis.
	 * @throws {NotFoundException} - If the refresh token is not found in Redis.
	 */
	async revokeRefreshToken(userId: string, jti: string): Promise<void> {
		// Check if the refresh token metadata exists in Redis
		const token = await this.redisService.exists(this.getRefreshKey(userId, jti));

		// If the token is not found, throw an error
		if (!token) throw new NotFoundException('Token not found');

		// Delete the specific refresh token metadata from Redis
		await this.redisService.del(this.getRefreshKey(userId, jti));

		// Remove the token ID from the user's list of active refresh tokens
		await this.redisService.srem(this.getUserTokensKey(userId), jti);
	}

	/**
	 * Revokes an access token by storing a revocation marker in Redis.
	 *
	 * @param {string} jti - The unique JWT ID of the access token to revoke.
	 * @returns {Promise<void>} - A promise that resolves once the revocation marker is set.
	 */
	async revokeAccessToken(jti: string): Promise<void> {
		await this.redisService.set(this.getAccessKey(jti), 'revoked', 'EX', this.ACCESS_TTL);
	}

	/**
	 * Revokes all refresh tokens for a given user, except the one corresponding to the current session.
	 *
	 * This method ensures that the current token (session) is at least 1 day old before allowing revocation.
	 * It then removes all other refresh tokens associated with the user from Redis.
	 * After revoking the tokens, it resets the token set in Redis to include only the current token.
	 *
	 * @param {string} userId - The ID of the user whose tokens are being revoked.
	 * @param {string} token - The current refresh token (JWT) used to validate and preserve the session.
	 * @throws {Promise<void>} - BadRequestException if the current token is less than 1 day old
	 * (to prevent accidental mass revocation).
	 */
	async revokeAllRefreshTokens(userId: string, token: string): Promise<void> {
		// Decode the provided token to extract its unique identifier (jti)
		const { jti: currentJti } = this.decodeToken(token, this.authOptions.issuer);

		// Check if the current token is old enough to allow revocation of other tokens
		const isOldEnough = await this.isTokenOlderThan(userId, currentJti);

		if (!isOldEnough) {
			throw new BadRequestException(
				'Cannot revoke all tokens: current session is less than 1 day old',
			);
		}

		// Get all stored token JTIs associated with the user
		const jtis = await this.redisService.smembers(this.getUserTokensKey(userId));

		// Iterate over all JTIs and remove each one from Redis, except the current session token
		for (const jti of jtis) {
			if (jti !== currentJti) {
				await this.redisService.del(this.getRefreshKey(userId, jti));
			}
		}

		// Reset the user's token set to include only the current session token
		await this.redisService.del(this.getUserTokensKey(userId));
		await this.redisService.sadd(this.getUserTokensKey(userId), currentJti);
	}

	/**
	 * Decodes a JWT token and returns the decoded payload.
	 *
	 * @param {string} token - The JWT access token to verify.
	 * @param {EUserApp} app - The app identifier (used as issuer or audience).
	 * @returns {ITokenPayload} - The decoded token payload.
	 */
	decodeToken(token: string, app: EUserApp): ITokenPayload {
		token = this.encryptionService.decrypt(token, app);
		return decodeJwt(token);
	}

	/**
	 * Retrieves metadata for all active refresh tokens associated with a user,
	 * excluding the sensitive `hashedToken` field for security reasons.
	 *
	 * @param {string} userId - The unique identifier of the user.
	 * @returns {Promise<Array<{ jti: string; meta: Omit<IRefreshTokenMeta, 'hashedToken'> }>>}
	 *   A list of token metadata objects with their JTI, excluding the hashed token.
	 */
	async getAllActiveTokens(
		userId: string,
	): Promise<Array<{ sessionId: string; meta: Omit<IRefreshTokenMeta, 'hashedToken'> }>> {
		// Fetch all refresh token JTIs associated with this user from Redis set
		const jtIs = await this.redisService.smembers(this.getUserTokensKey(userId));

		// If the user has no active tokens, return an empty list
		if (!jtIs.length) {
			return [];
		}

		// Create a Redis pipeline to efficiently fetch all token metadata in a single round-trip
		const pipeline = this.redisService.pipeline();
		for (const jti of jtIs) {
			const key = this.getRefreshKey(userId, jti);
			pipeline.get(key); // Queue a GET operation for each token
		}

		// Execute the pipeline and get the results (array of [error, value] tuples)
		const results = await pipeline.exec();

		// If there's an error or no results, return an empty list
		if (!results) return [];

		// Parse the results, filtering out missing or invalid entries
		const tokens = results
			.map(([, result], index) => {
				// If there's no value for a given JTI (possibly expired), skip it
				if (typeof result !== 'string') return null;

				try {
					// Parse the stored token metadata JSON
					// eslint-disable-next-line
					const { hashedToken, ...rest } = JSON.parse(result) as IRefreshTokenMeta;

					// Return the token's JTI and the metadata (without hashedToken)
					return {
						sessionId: jtIs[index],
						meta: rest,
					};
				} catch {
					// If parsing fails (e.g., corrupted entry), skip it
					return null;
				}
			})
			// Filter out null entries
			.filter(
				(entry): entry is { sessionId: string; meta: Omit<IRefreshTokenMeta, 'hashedToken'> } =>
					entry !== null,
			);

		// Return the list of valid token metadata entries
		return tokens;
	}

	/**
	 * Verifies a JWT token using a secret key specific to the provided application.
	 *
	 * This method retrieves the appropriate JWT secret from the environment variables
	 * based on the application name, then verifies the token. It ensures the decoded
	 * payload is valid and contains the required fields: `sub` (subject) and `jti` (JWT ID).
	 *
	 * @param {string} token - The JWT token to verify.
	 * @param {CryptoKey} cryptoPublicKey - The public key used to verify the token's signature.
	 * @returns {{ decoded: ITokenPayload; decryptedToken: string }} - The decoded token payload if verification is successful and the decrypted token.
	 * @throws {UnauthorizedException} - If the token is invalid or verification fails.
	 */
	private async verifyToken(
		token: string,
		cryptoPublicKey: CryptoKey,
	): Promise<{ decoded: ITokenPayload; decryptedToken: string }> {
		let decoded: ITokenPayload;

		try {
			// Decrypt the token using the provided secret
			token = this.encryptionService.decrypt(token, this.authOptions.issuer);

			// Attempt to verify and decode the JWT using the provided secret
			await jwtVerify(token, cryptoPublicKey, {
				algorithms: [this.algorithm],
			});
			decoded = decodeJwt(token);

			// Ensure the decoded is an object and contains the required fields: `sub` and `jti`
			if (typeof decoded !== 'object' || !('sub' in decoded && 'jti' in decoded)) {
				throw new UnauthorizedException('Invalid token');
			}
		} catch {
			// Catch verification errors and rethrow as an UnauthorizedException
			throw new UnauthorizedException('Invalid token');
		}

		return { decoded, decryptedToken: token };
	}

	/**
	 * Checks if a stored refresh token is older than a specified minimum age.
	 *
	 * This method retrieves the refresh token metadata from Redis using a unique key
	 * based on the user's ID and the token's JTI (JWT ID). It then calculates the age
	 * of the token and compares it against the provided `minAgeMs` threshold.
	 *
	 * @param {string} userId - The ID of the user associated with the token.
	 * @param {string} jti - The unique identifier (JWT ID) of the token.
	 * @param {number} minAgeMs - The minimum token age in milliseconds. Defaults to 24 hours.
	 * @returns {Promise<boolean>} - A Promise that resolves to `true` if the token is older than the specified age, or `false` otherwise.
	 * @throws {NotFoundException} - If the token metadata is not found in Redis.
	 */
	private async isTokenOlderThan(
		userId: string,
		jti: string,
		minAgeMs: number = 24 * 60 * 60 * 1000, // 1 day in ms
	): Promise<boolean> {
		// Generate the Redis key for the refresh token metadata using user ID and JTI
		const key = this.getRefreshKey(userId, jti);

		// Retrieve the stored token metadata from Redis
		const stored = await this.redisService.get(key);

		// If no metadata is found, throw a NotFoundException
		if (!stored) {
			throw new NotFoundException('Token not found');
		}

		// Parse the stored metadata and extract the creation timestamp
		const { createdAt } = JSON.parse(stored) as IRefreshTokenMeta;

		// Calculate the token's age
		const tokenAge = Date.now() - createdAt;

		// Return true if the token's age is greater than or equal to the minimum age
		return tokenAge >= minAgeMs;
	}
}
