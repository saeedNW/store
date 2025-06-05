import { Injectable, UnauthorizedException } from '@nestjs/common';
import { BaseAuthHandler } from './base-auth.handler';
import { IStrategyHandler } from '../interfaces/strategy.interface';
import { SendOtpDto } from '../dto/send-otp.dto';
import { EUserApp } from '@common/enums';
import { CheckOtpDto } from '../dto/check-otp.dto';
import { getEnvVariable } from '@common/utilities/functions';
import { RefreshTokenDto } from '../dto/refresh-token.dto';

/**
 * Authentication handler for the "STORE" user application.
 * Handles both existing and new users, allowing new users to be created during OTP handling.
 */
@Injectable()
export class StoreAuthHandler extends BaseAuthHandler implements IStrategyHandler {
	/** Defines the secret key used for JWT tokens. */
	private readonly jwtSecret: string = getEnvVariable('STORE_JWT_SECRET');

	/**
	 * Determines whether this handler can process requests for the given phone number
	 * within the context of the STORE application.
	 *
	 * @param {string} [phone] - The user's phone number.
	 * @param {boolean} [checkUserExistence] - Whether to check if the user exists.
	 * @returns {Promise<boolean>} - True if the user doesn't exist or is allowed to access STORE.
	 */
	async canHandle(phone?: string, checkUserExistence: boolean = true): Promise<boolean> {
		// Check if STORE is a configured issuer
		if (!this.authOptions.issuer.includes(EUserApp.STORE)) return false;

		// Skip user existence check if not required
		if (!checkUserExistence) return true;

		// Find user by phone
		const user = await this.userRepository.findOne({ where: { phone } });

		// Allow if user doesn't exist (STORE allows registration) or has STORE access
		return !user || user.allowedApps.includes(EUserApp.STORE);
	}

	/**
	 * Handles OTP generation for STORE users.
	 * Automatically creates a user if one does not already exist.
	 *
	 * @param {SendOtpDto} data - DTO containing the phone number.
	 * @returns {Promise<string>} - A string containing the generated OTP code.
	 */
	async sendOtpHandler(data: SendOtpDto): Promise<string> {
		// Find the user by phone and ensure STORE is one of their allowed apps
		let user = await this.getUser({ phone: data.phone }, EUserApp.STORE);

		// If user doesn't exist, create a new one
		if (!user) user = await this.userRepository.save({ phone: data.phone });

		// Generate and return OTP
		return this.generateAndStoreOtp(user.id);
	}

	/**
	 * Handles OTP verification and token generation for a user.
	 *
	 * @param {CheckOtpDto} data - DTO containing the user's phone number and OTP code.
	 * @returns {Promise<{ accessToken: string; refreshToken: string }>} - The access and refresh tokens upon successful verification.
	 * @throws {UnauthorizedException} - If the user is not found or OTP verification fails.
	 */
	async checkOtpHandler(data: CheckOtpDto): Promise<{ accessToken: string; refreshToken: string }> {
		// Retrieve the user associated with the given phone number in the STORE app context
		const user = await this.getUser({ phone: data.phone }, EUserApp.STORE);
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
		const user = await this.getUser({ id: sub }, EUserApp.STORE);

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
