import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { BaseAuthHandler } from './base-auth.handler';
import { IStrategyHandler } from '../interfaces/strategy.interface';
import { SendOtpDto } from '../dto/send-otp.dto';
import { EUserApp } from '@common/enums';
import { CheckOtpDto } from '../dto/check-otp.dto';
import { getEnvVariable } from '@common/utilities/functions';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { EOtpType } from '../enum/otp-type.enum';
import { ResetVerifyOtpDto } from '../dto/reset-verify.dto.ts';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { genSaltSync, hashSync } from 'bcrypt';

/**
 * Authentication handler for the "PANEL" user application.
 * Implements logic specific to verifying access and generating OTPs for PANEL users.
 */
@Injectable()
export class PanelAuthHandler extends BaseAuthHandler implements IStrategyHandler {
	/** Defines the secret key used for JWT tokens. */
	private readonly jwtSecret: string = getEnvVariable('PANEL_JWT_SECRET');

	/**
	 * Determines whether this handler can process requests for the given phone number
	 * within the context of the STORE application.
	 *
	 * @param {string} [phone] - The user's phone number.
	 * @param {boolean} [checkUserExistence] - Whether to check if the user exists.
	 * @returns {Promise<boolean>} - True if the user doesn't exist or is allowed to access STORE.
	 */
	async canHandle(phone?: string, checkUserExistence: boolean = true): Promise<boolean> {
		// Check if PANEL is a supported issuer
		if (!this.authOptions.issuer.includes(EUserApp.PANEL)) return false;

		// Skip user existence check if not required
		if (!checkUserExistence) return true;

		// Attempt to find the user by phone number
		const user = await this.userRepository.findOne({ where: { phone } });

		// Ensure the user exists and has permission for PANEL
		if (!user || !user.allowedApps.includes(EUserApp.PANEL)) {
			throw new ForbiddenException('You do not have permission to access this resource.');
		}

		return true;
	}

	/**
	 * Handles OTP generation for a user trying to authenticate via the PANEL app.
	 *
	 * - Validates that the user exists and has access to the PANEL app.
	 * - If the user is unauthorized or not found, access is denied.
	 * - If validation passes, generates and returns a new OTP.
	 *
	 * @param {SendOtpDto} data - DTO containing the user's phone number.
	 * @param {EOtpType} otpType - The type of OTP to generate (e.g., LOGIN, RESET_PASSWORD).
	 * @returns {Promise<string>} - A promise that resolves to the generated OTP code.
	 * @throws {ForbiddenException} - If the user does not exist or lacks PANEL access permissions.
	 */
	async sendOtpHandler(data: SendOtpDto, otpType: EOtpType): Promise<string> {
		// Find the user by phone and ensure PANEL is one of their allowed apps
		const user = await this.getUser({ phone: data.phone }, EUserApp.PANEL);

		// Deny access if the user doesn't exist or isn't allowed to access PANEL
		if (!user) {
			throw new ForbiddenException('You do not have permission to access this resource.');
		}

		// Generate and store a new OTP for the user
		return this.generateAndStoreOtp(user.id, otpType);
	}

	/**
	 * Handles OTP verification and token generation for a user.
	 *
	 * @param {CheckOtpDto} data - DTO containing the user's phone number and OTP code.
	 * @returns {Promise<{ accessToken: string; refreshToken: string }>} - The access and refresh tokens upon successful verification.
	 * @throws {UnauthorizedException} - If the user is not found or OTP verification fails.
	 */
	async checkOtpHandler(data: CheckOtpDto): Promise<{ accessToken: string; refreshToken: string }> {
		// Retrieve the user associated with the given phone number in the PANEL app context
		const user = await this.getUser({ phone: data.phone }, EUserApp.PANEL);
		// If user is not found, throw an unauthorized exception
		if (!user) throw new UnauthorizedException('Invalid credentials');

		// Verify the OTP for the retrieved user
		await this.verifyOtp(user.id, data.otp);

		// Generate JWT access and refresh tokens for the authenticated user
		const { accessToken, refreshToken } = await this.authTokenService.generateTokens(
			user.id,
			this.authOptions.issuer,
			this.jwtSecret,
		);

		// Mark the user's phone number as verified
		user.verify_phone = true;
		// Persist the updated user entity to the database
		await this.userRepository.save(user);

		// Return the generated tokens
		return { accessToken, refreshToken };
	}

	/**
	 * Verifies the OTP for a password reset in the PANEL application context.
	 *
	 * @param {ResetVerifyOtpDto} data - DTO containing the phone number and OTP to verify.
	 * @throws {UnauthorizedException} If the user is not found or credentials are invalid.
	 * @returns {Promise<void>} Resolves if the OTP is successfully verified; otherwise, throws an error.
	 */
	async resetVerifyHandler(data: ResetVerifyOtpDto): Promise<void> {
		// Retrieve the user associated with the given phone number in the PANEL app context
		const user = await this.getUser({ phone: data.phone }, EUserApp.PANEL);
		// If user is not found, throw an unauthorized exception
		if (!user) throw new UnauthorizedException('Invalid credentials');

		// Verify the OTP for the retrieved user
		await this.verifyOtp(user.id, data.otp, EOtpType.RESET_PASSWORD);
	}

	/**
	 * Handles the password reset logic for a user in the PANEL application context.
	 *
	 * @param {ResetPasswordDto} data - DTO containing the phone number and new password.
	 * @returns {Promise<void>} Resolves if the password reset is successful; throws otherwise.
	 * @throws {UnauthorizedException} If the user is not found or the OTP is invalid.
	 */
	async resetPasswordHandler(data: ResetPasswordDto): Promise<void> {
		// Retrieve the user associated with the given phone number in the PANEL app context
		const user = await this.getUser({ phone: data.phone }, EUserApp.PANEL);
		// If user is not found, throw an unauthorized exception
		if (!user) throw new UnauthorizedException('Invalid credentials');

		// Verify the OTP for the retrieved user
		await this.verifyResetPassword(user.id, EOtpType.RESET_PASSWORD);

		// Generate a new password hash using bcrypt
		const hashedPassword = hashSync(data.newPassword, genSaltSync(10));

		// Update the user's password in the database
		await this.userRepository.update(user.id, {
			password: hashedPassword,
		});
	}

	/**
	 * Handles the refresh token process by verifying the provided token,
	 * validating the associated user, revoking the old refresh token,
	 * and issuing a new pair of access and refresh tokens.
	 *
	 * @param {RefreshTokenDto} param0 - An object containing the refresh token.
	 * @param {string} param0.refreshToken - The refresh token to validate and exchange.
	 * @returns {Promise<{ accessToken: string; refreshToken: string }>}
	 * An object containing newly generated access and refresh tokens.
	 *
	 * @throws {UnauthorizedException} If the refresh token is invalid or the user is not found.
	 */
	async refreshTokenHandler({
		refreshToken: token,
	}: RefreshTokenDto): Promise<{ accessToken: string; refreshToken: string }> {
		// Extract `sub` (user ID) and `app` (application name) from the token payload
		const { sub, jti } = await this.authTokenService.verifyRefreshToken(
			token,
			this.authOptions.issuer, // Pass the expected issuer for additional token validation
		);

		// Query the user repository to ensure the user exists and is allowed to access the app
		const user = await this.getUser({ id: sub }, EUserApp.PANEL);

		// If no matching user is found, the token is considered invalid
		if (!user) throw new UnauthorizedException('Invalid token');

		// Revoke the refresh token to invalidate it
		await this.authTokenService.revokeRefreshToken(sub, jti);

		// Generate new JWT access and refresh tokens for the authenticated user
		return await this.authTokenService.generateTokens(
			user.id,
			this.authOptions.issuer,
			this.jwtSecret,
		);
	}
}
