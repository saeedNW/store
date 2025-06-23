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
import { EOtpType } from '../enum/otp-type.enum';

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
		@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
		@Inject('AUTH_OPTIONS') private readonly authOptions: IAuthModuleOptions,
		@Inject('REDIS_CONNECTION') private readonly redisService: Redis,
		private readonly authTokenService: AuthTokenService,
	) {}

	/**
	 * Constructs a Redis key used for storing OTPs associated with a user and OTP type.
	 *
	 * @param {string} userId - The ID of the user for whom the OTP is generated.
	 * @param {EOtpType} otpType - The type of OTP being generated (e.g., RESET_PASSWORD).
	 * @returns {string} A namespaced Redis key for storing/retrieving the OTP.
	 */
	private getOtpKey(userId: string, otpType: EOtpType): string {
		return `auth:otp:${otpType}:${userId}`;
	}

	/**
	 * Retrieves an existing OTP object from Redis using the provided key.
	 *
	 * @param {string} otpKey - The Redis key associated with the OTP object.
	 * @returns {Promise<TOtpObject | null>} A promise that resolves to the OTP object if found, or null if not found.
	 */
	private async getExistingOtp(otpKey: string): Promise<TOtpObject | null> {
		const otpString = await this.redisService.get(otpKey);
		return otpString ? (JSON.parse(otpString) as TOtpObject) : null;
	}

	/**
	 * Generates a new OTP code and stores it in Redis for a specific user and OTP type.
	 * Prevents OTP generation if a recent one already exists within a 2-minute window.
	 *
	 * @param {string} userId - The ID of the user for whom the OTP is being generated.
	 * @param {EOtpType} otpType - The type/category of OTP (e.g., login, register, verify).
	 * @returns {Promise<string>} - The newly generated OTP code.
	 * @throws {BadRequestException} If a valid OTP was recently generated and is still active.
	 */
	private async generateAndStoreOtp(userId: string, otpType: EOtpType): Promise<string> {
		const otp: TOtpObject = {
			code: randomInt(10000, 99999).toString(), // Generate a 5-digit random OTP
			created_at: Date.now(),
			userId,
		};

		// Generate Redis key for storing the OTP
		const otpKey = this.getOtpKey(userId, otpType);

		// Check if there's an existing OTP stored in Redis
		const existingOtp = await this.getExistingOtp(otpKey);

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
		await this.redisService.set(otpKey, JSON.stringify(otp), 'EX', 2 * 60);
		return otp.code;
	}

	/**
	 * Verifies the provided OTP code for a given user.
	 *
	 * @param {string} userId - The ID of the user whose OTP is being verified.
	 * @param {string} code - The OTP code provided by the user.
	 * @param {EOtpType} [otpType] - The type/category of OTP (e.g., login, register, verify).
	 * @returns {Promise<boolean>} - Returns true if the OTP is valid; otherwise, throws an UnauthorizedException.
	 * @throws {UnauthorizedException} If no OTP exists for the user or the provided code does not match.
	 */
	private async verifyOtp(
		userId: string,
		code: string,
		otpType: EOtpType = EOtpType.LOGIN,
	): Promise<boolean> {
		// Generate Redis key for storing the OTP
		const otpKey = this.getOtpKey(userId, otpType);
		// Retrieve the existing OTP for the given user
		const otp = await this.getExistingOtp(otpKey);

		// If no OTP exists or the code does not match, deny access
		if (!otp || otp.code !== code) {
			throw new UnauthorizedException('Invalid credentials');
		}

		// Delete the OTP from Redis after successful verification
		await this.redisService.del(otpKey);

		// If the OTP type is RESET_PASSWORD, mark it as verified in Redis
		if (otpType === EOtpType.RESET_PASSWORD) {
			await this.redisService.set(otpKey, 'verified', 'EX', 5 * 60);
		}

		// OTP is valid
		return true;
	}

	/**
	 * Verifies whether the user is allowed to proceed with the password reset by checking the OTP status.
	 *
	 *
	 * @param {string} userId - The ID of the user attempting to reset their password.
	 * @param {EOtpType} otpType - The type of OTP used for verification (e.g., reset password).
	 * @returns {Promise<boolean>} Returns `true` if the OTP is valid and not yet verified.
	 * @throws {UnauthorizedException} If the OTP is missing or already verified.
	 */
	private async verifyResetPassword(userId: string, otpType: EOtpType): Promise<boolean> {
		// Generate the Redis key used to store/retrieve the OTP for the user and specified OTP type
		const otpKey = this.getOtpKey(userId, otpType);

		// Attempt to retrieve the OTP value from Redis
		const otp = await this.redisService.get(otpKey);

		// If no OTP is found or it has already been marked as verified, deny access
		if (!otp || otp !== 'verified') {
			throw new UnauthorizedException('Invalid credentials');
		}

		// Delete the OTP from Redis after successful verification
		await this.redisService.del(otpKey);

		// OTP is valid and has not yet been used
		return true;
	}

	/**
	 * Retrieves a user based on dynamic filters (such as phone number or ID)
	 * and ensures the user has access to the specified application.
	 *
	 * This method allows flexible querying by accepting partial user-identifying fields.
	 * At least one of the supported filters (`id` or `phone`) must be provided.
	 *
	 * @param {Partial<Pick<UserEntity, 'id' | 'phone'>>} filters - A partial object containing user identifiers.
	 *        Supported keys include:
	 *        - `id`: The unique user ID.
	 *        - `phone`: The user's phone number.
	 * @param {EUserApp} app - The application the user must have access to (must be present in `user.allowedApps`).
	 * @returns {Promise<UserEntity | null>} - A promise that resolves to the user entity if found, or `null` if no matching user exists.
	 */
	private async getUser(
		filters: Partial<Pick<UserEntity, 'id' | 'phone'>>,
		app: EUserApp,
	): Promise<UserEntity | null> {
		// Start building the query to fetch the user
		const query = this.userRepository
			.createQueryBuilder('user')
			// Filter users by app access using PostgreSQL's ANY clause
			.andWhere(':app = ANY(user.allowedApps)', { app });

		// Conditionally add filter for user ID
		if (filters.id) {
			query.andWhere('user.id = :id', { id: filters.id });
		}

		// Conditionally add filter for user phone number
		if (filters.phone) {
			query.andWhere('user.phone = :phone', { phone: filters.phone });
		}

		// Execute the query and return the matching user, or null if not found
		return await query.getOne();
	}
}
