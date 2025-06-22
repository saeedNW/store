import { DynamicModule, Module } from '@nestjs/common';
import Redis, { RedisOptions } from 'ioredis';
import { RedisService } from './redis.service';

/**
 * RedisModule is a dynamic NestJS module that sets up a Redis connection using ioredis.
 *
 * This module is designed for use within a NestJS monorepo containing multiple applications.
 * Each application (e.g., 'panel', 'shop', 'store') can configure its own instance of this module
 * with distinct Redis options—especially a unique `keyPrefix` to prevent key collisions.
 *
 * Example usage per application:
 *
 * ```ts
 * RedisModule.register({
 *   host: getEnvVariable('REDIS_HOST'),
 *   port: parseInt(getEnvVariable('REDIS_PORT'), 10),
 *   password: getEnvVariable('REDIS_PASSWORD'),
 *   keyPrefix: 'panel:', // or 'shop:' or 'store:' depending on the app
 * })
 * ```
 */
@Module({})
export class RedisModule {
	/**
	 * Registers the Redis module with custom Redis connection options.
	 *
	 * The options are typically environment-specific and scoped per application in a monorepo.
	 * The `keyPrefix` is especially important to namespace Redis keys and avoid cross-app conflicts.
	 *
	 * @param options - RedisOptions from ioredis, including host, port, password, and keyPrefix.
	 * @returns A DynamicModule that provides a Redis connection and exports RedisService.
	 */
	static register(options: RedisOptions): DynamicModule {
		return {
			module: RedisModule,

			// Provides a namespaced Redis connection instance per app using the given options.
			providers: [
				{
					provide: 'REDIS_CONNECTION',
					useFactory: (): Redis => new Redis(options),
				},
			],

			// Export RedisService so that other modules in the app can access Redis functionality.
			exports: [RedisService],
		};
	}
}
