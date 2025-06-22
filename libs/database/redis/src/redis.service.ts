import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

/**
 * RedisService is a wrapper around a Redis client instance.
 *
 * It provides convenient methods to interact with Redis, such as `set`, `get`, `del`, and `exists`.
 * The service is designed to work with an injected Redis connection, which is configured
 * per application via the RedisModule using a unique `keyPrefix`.
 *
 * This ensures isolation between different apps (e.g. 'panel', 'shop', 'store') in a monorepo
 * by namespacing Redis keys accordingly.
 */
@Injectable()
export class RedisService {
	/**
	 * Injects a Redis client instance, configured in the RedisModule.
	 *
	 * @param redisService - An instance of Redis, injected via the 'REDIS_CONNECTION' token.
	 */
	constructor(@Inject('REDIS_CONNECTION') private readonly redisService: Redis) {}

	/**
	 * Stores a value in Redis under a given key with a specified TTL (time to live).
	 *
	 * @param {string} key - The Redis key.
	 * @param {any} value - The value to be stored (will be stringified).
	 * @param {number} ttl - Time to live (in seconds).
	 * @returns {Promise<string>} A promise resolving to 'OK' if successful.
	 */
	async set(key: string, value: any, ttl: number): Promise<string> {
		return await this.redisService.set(key, JSON.stringify(value), 'EX', ttl);
	}

	/**
	 * Retrieves and parses a JSON value from Redis by key.
	 *
	 * @param {string} key - The Redis key.
	 * @returns {Promise<any>} A promise resolving to the parsed value or null if not found.
	 */
	async get(key: string): Promise<any> {
		const result = await this.redisService.get(key);
		if (result) return JSON.parse(result);
		return null;
	}

	/**
	 * Deletes a key from Redis.
	 *
	 * @param {string} key - The Redis key to delete.
	 * @returns {Promise<number>} A promise resolving to the number of keys that were removed.
	 */
	async del(key: string): Promise<number> {
		return await this.redisService.del(key);
	}

	/**
	 * Checks if a key exists in Redis.
	 *
	 * @param {string} key - The Redis key to check.
	 * @returns {Promise<boolean>} A promise that resolves to `true` if the key exists, or `false` otherwise.
	 */
	async exists(key: string): Promise<boolean> {
		const result = await this.redisService.exists(key);
		return result === 1;
	}
}
