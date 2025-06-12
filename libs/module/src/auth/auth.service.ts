import {
	BadRequestException,
	Inject,
	Injectable,
	Scope,
	UnauthorizedException,
} from '@nestjs/common';
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
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { RevokeSessionDto } from './dto/revoke-session.dto';
import { ResetRequestOtpDto } from './dto/reset-request.dto';
import { EOtpType } from './enum/otp-type.enum';
import { ResetVerifyOtpDto } from './dto/reset-verify.dto.ts';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { LoginDto } from './dto/login.dto';

/**
 * Core service responsible for handling OTP-based authentication.
 * Delegates logic to appropriate strategy handlers based on phone number and app context.
 */
@Injectable({ scope: Scope.REQUEST })
export class AuthService {
	constructor(
		@InjectRepository(UserEntity) protected readonly userRepository: Repository<UserEntity>,
		@Inject('STRATEGY_HANDLERS') private readonly handlers: IStrategyHandler[],
		@Inject('AUTH_OPTIONS') protected readonly authOptions: IAuthModuleOptions,
		@Inject(REQUEST) private readonly request: Request,
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
		const otp = await strategy.handler.sendOtpHandler(sendOtpDto, EOtpType.LOGIN);

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
	 * Handles the login process by verifying the user's credentials.
	 *
	 * @param {LoginDto} loginDto - The login data transfer object containing the user's phone number and credentials.
	 * @returns {Promise<{ message: string; accessToken: string; refreshToken: string }>}
	 * An object containing a success message and the generated access and refresh tokens.
	 */
	async login(
		loginDto: LoginDto,
	): Promise<{ message: string; accessToken: string; refreshToken: string }> {
		// Sanitize and transform the incoming DTO, removing any extraneous fields
		loginDto = plainToClass(LoginDto, loginDto, {
			excludeExtraneousValues: true,
		});

		// Retrieve the appropriate OTP handler strategy based on the phone number
		const strategy = await this.getHandler(loginDto.phone);

		// Login credentials verification and token generation
		const { accessToken, refreshToken } = await strategy.handler.loginHandler(loginDto);

		// Return a success message along with the generated tokens
		return {
			message: 'Login successful',
			accessToken,
			refreshToken,
		};
	}

	/**
	 * Handles the OTP reset request for password reset flow.
	 *
	 * @param {ResetRequestOtpDto} resetRequestOtpDto - DTO containing the phone number and other required info.
	 * @returns {Promise<{ message: string; otp?: string }>} - A success message and optionally the OTP.
	 * @throws BadRequestException if no handler is suitable for the phone number.
	 */
	async resetReq(
		resetRequestOtpDto: ResetRequestOtpDto,
	): Promise<{ message: string; otp?: string }> {
		// Ensure DTO is validated
		resetRequestOtpDto = plainToClass(ResetRequestOtpDto, resetRequestOtpDto, {
			excludeExtraneousValues: true,
		});

		// Get appropriate strategy for the phone number
		const strategy = await this.getHandler(resetRequestOtpDto.phone);

		// Generate OTP via the selected handler
		const otp = await strategy.handler.sendOtpHandler(resetRequestOtpDto, EOtpType.RESET_PASSWORD);

		// Send OTP via SMS
		await this.smsService.sendOtp(resetRequestOtpDto.phone, otp);

		// Return message (and OTP in non-production for debugging/testing)
		return {
			message: 'OTP sent successfully',
			otp: process.env.NODE_ENV !== 'production' ? otp : undefined,
		};
	}

	/**
	 * Verifies a user's OTP for a password reset.
	 *
	 * @param {ResetVerifyOtpDto} resetVerifyOtpDto - The data transfer object containing the OTP and phone number.
	 * @returns {Promise<string>} A message indicating the OTP was successfully verified.
	 */
	async resetVerify(resetVerifyOtpDto: ResetVerifyOtpDto): Promise<string> {
		// Sanitize and transform the input to match the expected DTO structure
		resetVerifyOtpDto = plainToClass(ResetVerifyOtpDto, resetVerifyOtpDto, {
			excludeExtraneousValues: true,
		});

		// Retrieve the appropriate OTP verification strategy based on the phone number
		const strategy = await this.getHandler(resetVerifyOtpDto.phone);

		// Call the strategy's resetVerify handler to validate the OTP
		await strategy.handler.resetVerifyHandler(resetVerifyOtpDto);

		// Return success message after successful OTP verification
		return 'OTP verified successfully';
	}

	/**
	 * Resets the user's password using an OTP-based strategy.
	 *
	 * @param {ResetPasswordDto} resetPasswordDto - The DTO containing the user's phone number and new password.
	 * @returns {Promise<string>} A message indicating the password was reset successfully.
	 */
	async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<string> {
		// Retrieve the appropriate OTP verification strategy based on the phone number
		const strategy = await this.getHandler(resetPasswordDto.phone);

		// Call the strategy's resetPassword handler to reset the user's password
		await strategy.handler.resetPasswordHandler(resetPasswordDto);

		// Return success message after successful password reset
		return 'Password reset successfully';
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
	 * @param {RefreshTokenDto} refreshTokenDto - An object containing the refresh token.
	 * @returns A promise that resolves to an object containing a success message, a new access token, and a new refresh token.
	 * @throws UnauthorizedException if the refresh token is invalid or user validation fails.
	 */
	async refreshToken(
		refreshTokenDto: RefreshTokenDto,
	): Promise<{ message: string; accessToken: string; refreshToken: string }> {
		// Get appropriate strategy for the phone number
		const strategy = await this.getHandler(undefined, false);

		// Delegate OTP verification and token generation to the strategy's handler
		const { accessToken, refreshToken } =
			await strategy.handler.refreshTokenHandler(refreshTokenDto);

		// Return a success message along with the generated tokens
		return {
			message: 'OTP verified successfully',
			accessToken,
			refreshToken,
		};
	}

	/**
	 * Retrieves all active user sessions for the currently authenticated user.
	 *
	 * @returns A promise that resolves to an array of active session objects.
	 */
	async getUserSessions() {
		// Call the authTokenService to get all active tokens for the current user
		const sessions = await this.authTokenService.getAllActiveTokens(this.request.userId as string);

		return { sessions };
	}

	/**
	 * Logs out a user by revoking their access and refresh tokens.
	 *
	 * This method decodes the provided JWT token to extract its unique identifier (`jti`).
	 * It then revokes both the access token and the associated refresh token to effectively
	 * log the user out.
	 *
	 * @param {string} token - The JWT access token to be revoked.
	 * @returns {Promise<string>} - A Promise that resolves once both tokens are revoked.
	 */
	async logout(token: string): Promise<string> {
		// Decode the token to get the token ID (jti)
		const { jti } = this.authTokenService.decodeToken(token);

		// Revoke the access token using its unique identifier
		await this.authTokenService.revokeAccessToken(jti);

		// Revoke the refresh token associated with the subject and token ID
		await this.authTokenService.revokeRefreshToken(this.request.userId as string, jti);

		// Return a success message
		return 'Logged out successfully';
	}

	/**
	 * Revokes all refresh tokens for the currently authenticated user, except the current session token.
	 *
	 * Delegates the revocation logic to `authTokenService.revokeAllRefreshTokens`, which ensures that
	 * only tokens older than 1 day can trigger a mass revocation.
	 *
	 * @param {string} token - The current refresh token (used to identify and preserve the active session).
	 * @returns {Promise<string>} - A success message indicating that the tokens have been revoked.
	 * @throws BadRequestException if the current token is not old enough to allow revocation.
	 */
	async revokeTokens(token: string): Promise<string> {
		// Call the service to revoke all refresh tokens for the current user, except the current session
		await this.authTokenService.revokeAllRefreshTokens(this.request.userId as string, token);

		// Return a confirmation message
		return 'Tokens revoked successfully';
	}

	/**
	 * Revokes a specific user session by its session ID.
	 *
	 * @param {RevokeSessionDto} revokeSessionDto - Data transfer object containing the session ID to revoke.
	 * @returns {Promise<string>} - A promise that resolves to a success message once the session is revoked.
	 */
	async revokeSession(revokeSessionDto: RevokeSessionDto): Promise<string> {
		// Revoke the refresh token for the current user and specified session ID
		await this.authTokenService.revokeRefreshToken(
			this.request.userId as string, // The ID of the user making the request
			revokeSessionDto.sessionId, // The session ID to revoke
		);

		// Return a confirmation message after successful revocation
		return 'Session revoked successfully';
	}

	/**
	 * Identifies which strategy handler can process the given phone number.
	 *
	 * @param {string} [phone] - The user's phone number
	 * @param {boolean} [checkUserExistence] - Whether to check if the user exists.r.
	 * @returns {Promise<{ handler: IStrategyHandler; canHandle: boolean }>} - An object containing the handler and its eligibility status.
	 * @throws BadRequestException if no handler can process the phone number.
	 */
	protected async getHandler(
		phone?: string,
		checkUserExistence: boolean = true,
	): Promise<{ handler: IStrategyHandler; canHandle: boolean }> {
		// Evaluate all handlers in parallel to see which can handle the phone
		const results = await Promise.all(
			this.handlers.map(async (handler) => ({
				handler,
				canHandle: await handler.canHandle(phone, checkUserExistence),
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
