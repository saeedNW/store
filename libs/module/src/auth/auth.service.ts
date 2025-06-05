import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { SendOtpDto } from './dto/send-otp.dto';
import { IStrategyHandler } from './interfaces/strategy.interface';
import { SmsService } from '@modules/sms';
import { CheckOtpDto } from './dto/check-otp.dto';
import { plainToClass } from 'class-transformer';
import { AuthTokenService } from './token.service';
import { IAuthModuleOptions } from './interfaces/auth-module-options.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@database/postgres/entities';
import { Repository } from 'typeorm';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { getEnvVariable } from '@common/utilities/functions';

/**
 * Core service responsible for handling OTP-based authentication.
 * Delegates logic to appropriate strategy handlers based on phone number and app context.
 */
@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(UserEntity) protected readonly userRepository: Repository<UserEntity>,
		@Inject('STRATEGY_HANDLERS') private readonly handlers: IStrategyHandler[],
		@Inject('AUTH_OPTIONS') protected readonly authOptions: IAuthModuleOptions,
		private readonly smsService: SmsService,
		private readonly authTokenService: AuthTokenService,
	) {}

	/**
	 * Sends an OTP to the given phone number using the appropriate strategy handler.
	 *
	 * @param {SendOtpDto} sendOtpDto - Data transfer object containing the phone number.
	 * @returns {Promise<{ message: string; otp?: string }>}  - A success message and the OTP (only in non-production environments).
	 * @throws BadRequestException if no handler is suitable for the phone number.
	 */
	async sendOtp(sendOtpDto: SendOtpDto): Promise<{ message: string; otp?: string }> {
		// Ensure DTO is validated
		sendOtpDto = plainToClass(SendOtpDto, sendOtpDto, {
			excludeExtraneousValues: true,
		});

		// Get appropriate strategy for the phone number
		const strategy = await this.getHandler(sendOtpDto.phone);

		// Generate OTP via the selected handler
		const otp = await strategy.handler.sendOtpHandler(sendOtpDto);

		// Send OTP via SMS
		await this.smsService.sendOtp(sendOtpDto.phone, otp);

		// Return message (and OTP in non-production for debugging/testing)
		return {
			message: 'OTP sent successfully',
			otp: process.env.NODE_ENV !== 'production' ? otp : undefined,
		};
	}

	/**
	 * Verifies the OTP provided by the user and returns authentication tokens upon success.
	 *
	 * @param {CheckOtpDto} checkOtpDto - Data Transfer Object containing the phone number and OTP code.
	 * @returns {Promise<{ message: string; accessToken: string; refreshToken: string }>}
	 * A success message along with generated access and refresh tokens.
	 */
	async checkOtp(
		checkOtpDto: CheckOtpDto,
	): Promise<{ message: string; accessToken: string; refreshToken: string }> {
		// Sanitize and transform the incoming DTO, removing any extraneous fields
		checkOtpDto = plainToClass(CheckOtpDto, checkOtpDto, {
			excludeExtraneousValues: true,
		});

		// Retrieve the appropriate OTP handler strategy based on the phone number
		const strategy = await this.getHandler(checkOtpDto.phone);

		// Delegate OTP verification and token generation to the strategy's handler
		const { accessToken, refreshToken } = await strategy.handler.checkOtpHandler(checkOtpDto);

		// Return a success message along with the generated tokens
		return {
			message: 'OTP verified successfully',
			accessToken,
			refreshToken,
		};
	}

	/**
	 * Validates the given access token by verifying its claims and ensuring the associated user
	 * has permission to access the specified application.
	 *
	 * This method checks that the token is valid and that the user it belongs to exists in the system
	 * and is allowed to access the app identified in the token's payload.
	 *
	 * @param {string} token - The access token to validate.
	 * @returns {Promise<string>} - A promise that resolves to the user ID (`sub`) if validation is successful.
	 * @throws {UnauthorizedException} If the token is invalid or the user is not authorized for the app.
	 */
	async validateAccessToken(token: string): Promise<string> {
		// Extract `sub` (user ID) and `app` (application name) from the token payload
		const { sub, app } = await this.authTokenService.verifyAccessToken(
			token,
			this.authOptions.issuer, // Pass the expected issuer for additional token validation
		);

		// Query the user repository to ensure the user exists and is allowed to access the app
		await this.getUser(sub, app);

		// Return the user ID (subject) from the token payload
		return sub;
	}

	/**
	 * Refreshes the access and refresh tokens using a valid refresh token.
	 *
	 * @param {RefreshTokenDto} param0 - An object containing the refresh token.
	 * @returns A promise that resolves to an object containing a success message, a new access token, and a new refresh token.
	 * @throws UnauthorizedException if the refresh token is invalid or user validation fails.
	 */
	async refreshToken({
		refreshToken: token,
	}: RefreshTokenDto): Promise<{ message: string; accessToken: string; refreshToken: string }> {
		// Retrieve the JWT secret specific to the application from environment variables
		const secret = getEnvVariable(`${this.authOptions.issuer.toUpperCase()}_JWT_SECRET`);

		// Extract `sub` (user ID) and `app` (application name) from the token payload
		const { sub, app, jti } = await this.authTokenService.verifyRefreshToken(
			token,
			this.authOptions.issuer, // Pass the expected issuer for additional token validation
		);

		// Query the user repository to ensure the user exists and is allowed to access the app
		const user = await this.getUser(sub, app);

		// Revoke the refresh token to invalidate it
		await this.authTokenService.revokeRefreshToken(sub, jti);

		// Generate new JWT access and refresh tokens for the authenticated user
		const { accessToken, refreshToken } = await this.authTokenService.generateTokens(
			user.id,
			this.authOptions.issuer,
			secret,
		);

		// Return a success message along with the generated tokens
		return {
			message: 'OTP verified successfully',
			accessToken,
			refreshToken,
		};
	}

	/**
	 * Identifies which strategy handler can process the given phone number.
	 *
	 * @param {string} phone - The user's phone number.
	 * @returns {Promise<{ handler: IStrategyHandler; canHandle: boolean }>} - An object containing the handler and its eligibility status.
	 * @throws BadRequestException if no handler can process the phone number.
	 */
	protected async getHandler(
		phone: string,
	): Promise<{ handler: IStrategyHandler; canHandle: boolean }> {
		// Evaluate all handlers in parallel to see which can handle the phone
		const results = await Promise.all(
			this.handlers.map(async (handler) => ({
				handler,
				canHandle: await handler.canHandle(phone),
			})),
		);

		// Find the first handler that returns true for canHandle
		const strategy = results.find((r) => r.canHandle);

		if (!strategy) {
			throw new BadRequestException('No suitable handler found');
		}

		return strategy;
	}

	/**
	 * Retrieves a user by ID and verifies that they are authorized to access the specified application.
	 *
	 * This method queries the user repository to ensure that:
	 * - The user exists.
	 * - The application is included in the user's list of allowed applications (`allowedApps`).
	 *
	 * @param {string} id - The unique identifier of the user.
	 * @param {string} app - The application name to check access permission against.
	 * @returns {Promise<UserEntity>} - A promise that resolves to the user entity if found and authorized.
	 * @throws UnauthorizedException if the user does not exist or is not authorized for the application.
	 */
	protected async getUser(id: string, app: string): Promise<UserEntity> {
		// Query the user repository to ensure the user exists and is allowed to access the app
		const user = await this.userRepository
			.createQueryBuilder('user')
			.where('user.id = :id', { id }) // Match by user ID
			.andWhere(':app = ANY(user.allowedApps)', { app }) // Ensure the app is in the user's allowed apps
			.getOne();

		// If no matching user is found, the token is considered invalid
		if (!user) {
			throw new UnauthorizedException('Invalid token');
		}

		return user;
	}
}
