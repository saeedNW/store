import { RedisOptions } from 'ioredis';

/**
 * Options for configuring the authentication module.
 *
 * @example
 * ```ts
 * {
 *   jwtSecret: process.env.PANEL_JWT_SECRET,
 *   accessTokenExpiresIn: '15m',
 *   refreshTokenExpiresIn: '7d',
 *   accessTokenExpiresTimeStamp: 900,
 *   refreshTokenExpiresTimeStamp: 604800,
 *   redisConfig: { host: 'localhost', port: 6379, password: 'password', keyPrefix: 'panel:' },
 *   issuer: 'panel-app',
 *   audience: 'panel-users',
 * }
 * ```
 */
export interface IAuthModuleOptions {
	/** Secret key used to sign JWTs. */
	jwtSecret: string;

	/** Expiry duration for the access token (e.g., '15m', '1h'). */
	accessTokenExpiresIn: string;

	/** Expiry duration for the refresh token (e.g., '7d', '30d'). */
	refreshTokenExpiresIn: string;

	/** Expiry timestamp for the refresh token in seconds. */
	refreshTokenTimeToLive: number;

	/**
	 * Configuration for Redis cache.
	 * Should conform to ioredis's RedisOptions.
	 * @type  {RedisOptions}
	 */
	redisConfig: RedisOptions;

	/** The issuer of the JWT (e.g., 'panel-app'). */
	issuer: string;

	/** The intended audience for the JWT (e.g., 'panel-users'). */
	audience: string;
}
