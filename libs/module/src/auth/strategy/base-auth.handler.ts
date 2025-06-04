import { BadRequestException, Inject, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Redis from 'ioredis';
import { randomInt } from 'crypto';
import { UserEntity } from '@database/postgres/entities';
import { IAuthModuleOptions } from '../interfaces/auth-module-options.interface';
import { TOtpObject } from '../types/otp.type';
import { EUserApp } from '@common/enums';
import { AuthTokenService } from '../token.service';

/**
 * Abstract base class for handling authentication-related logic.
 * Provides methods to generate, store, and retrieve OTP codes tied to a specific user.
 */
export abstract class BaseAuthHandler {
	/**
	 * Constructor to inject dependencies.
	 *
	 * @param userRepository - TypeORM repository for UserEntity.
	 * @param authOptions - Configuration options for the authentication module.
	 * @param redisService - Redis client instance used to store and retrieve OTPs.
	 * @param authTokenService - Service for managing authentication tokens.
	 */
	constructor(
		@InjectRepository(UserEntity) protected readonly userRepository: Repository<UserEntity>,
		@Inject('AUTH_OPTIONS') protected readonly authOptions: IAuthModuleOptions,
		@Inject('REDIS_CONNECTION') protected readonly redisService: Redis,
		protected readonly authTokenService: AuthTokenService,
	) {}

	/**
	 * Retrieves an existing OTP object for a given user from Redis.
	 *
	 * @param {string} userId - The ID of the user whose OTP is being retrieved.
	 * @returns {Promise<TOtpObject | null>} - The OTP object if found, or null otherwise.
	 */
	protected async getExistingOtp(userId: string): Promise<TOtpObject | null> {
		const otpString = await this.redisService.get(`auth:otp:${userId}`);
		return otpString ? (JSON.parse(otpString) as TOtpObject) : null;
	}

	/**
	 * Generates a new OTP code and stores it in Redis for a specific user.
	 * Prevents OTP generation if a recent one already exists within a 2-minute window.
	 *
	 * @param {string} userId - The ID of the user for whom the OTP is being generated.
	 * @returns {Promise<string>} - The generated OTP code.
	 * @throws BadRequestException if a valid OTP was recently generated and is still active.
	 */
	protected async generateAndStoreOtp(userId: string): Promise<string> {
		const otp: TOtpObject = {
			code: randomInt(10000, 99999).toString(), // Generate a 5-digit random OTP
			created_at: Date.now(),
			userId,
		};

		const existingOtp = await this.getExistingOtp(userId);

		if (existingOtp) {
			const now = Date.now();
			const waitTimeMs = existingOtp.created_at + 2 * 60 * 1000; // 2-minute window

			// If a previous OTP was generated within the last 2 minutes, prevent a new one
			if (now < waitTimeMs) {
				const secondsLeft = Math.ceil((waitTimeMs - now) / 1000);
				throw new BadRequestException(
					`Please wait ${secondsLeft} seconds before requesting another OTP.`,
				);
			}
		}

		// Store the new OTP in Redis with a 2-minute expiration
		await this.redisService.set(`auth:otp:${userId}`, JSON.stringify(otp), 'EX', 2 * 60);
		return otp.code;
	}

	/**
	 * Verifies the provided OTP code for a given user.
	 *
	 * @param {string} userId - The ID of the user whose OTP is being verified.
	 * @param {string} code - The OTP code provided by the user.
	 * @returns {Promise<boolean>} - Returns true if the OTP is valid; otherwise, throws an UnauthorizedException.
	 * @throws {UnauthorizedException} If no OTP exists for the user or the provided code does not match.
	 */
	protected async verifyOtp(userId: string, code: string): Promise<boolean> {
		// Retrieve the existing OTP for the given user
		const otp = await this.getExistingOtp(userId);

		// If no OTP exists or the code does not match, deny access
		if (!otp || otp.code !== code) {
			throw new UnauthorizedException('Invalid credentials');
		}

		// OTP is valid
		return true;
	}

	/**
	 * Retrieves a user based on their phone number and application access.
	 *
	 * @param {string} phone - The user's phone number to search for.
	 * @param {EUserApp} app - The application the user must have access to.
	 * @returns {Promise<UserEntity | null>} - A promise that resolves to the user entity if found, or null if no matching user is found.
	 */
	protected async getUser(phone: string, app: EUserApp): Promise<UserEntity | null> {
		// Query for a user that matches the given phone number and has required app access
		return await this.userRepository
			.createQueryBuilder('user')
			.where('user.phone = :phone', { phone })
			.andWhere(':app = ANY(user.allowedApps)', { app })
			.getOne();
	}
}
