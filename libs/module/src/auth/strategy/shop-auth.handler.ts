import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { BaseAuthHandler } from './base-auth.handler';
import { IStrategyHandler } from '../interfaces/strategy.interface';
import { SendOtpDto } from '../dto/send-otp.dto';
import { EUserApp } from '@common/enums';
import { CheckOtpDto } from '../dto/check-otp.dto';
import { getEnvVariable } from '@common/utilities/functions';

/**
 * Authentication handler for the "SHOP" user application.
 * Implements logic for verifying SHOP users and generating OTPs.
 */
@Injectable()
export class ShopAuthHandler extends BaseAuthHandler implements IStrategyHandler {
	/** Defines the secret key used for JWT tokens. */
	private readonly jwtSecret: string = getEnvVariable('SHOP_JWT_SECRET');

	/**
	 * Checks whether this handler can process OTP requests for the given phone number
	 * in the context of the SHOP application.
	 *
	 * @param {string} phone - The user's phone number to validate.
	 * @returns {Promise<boolean>} - A boolean indicating handler eligibility.
	 * @throws ForbiddenException if the user is not authorized for SHOP access.
	 */
	async canHandle(phone: string): Promise<boolean> {
		// Ensure SHOP is listed as an allowed issuer
		if (!this.authOptions.issuer.includes(EUserApp.SHOP)) return false;

		// Look up user by phone number
		const user = await this.userRepository.findOne({ where: { phone } });

		// Verify that the user exists and is authorized for SHOP
		if (!user || !user.allowedApps.includes(EUserApp.SHOP)) {
			throw new ForbiddenException('You do not have permission to access this resource.');
		}

		return true;
	}

	/**
	 * Generates and returns an OTP for a SHOP user.
	 * Ensures the user exists and has SHOP access permissions before proceeding.
	 *
	 * @param {SendOtpDto} data - DTO containing the phone number.
	 * @returns {Promise<string>} - A string representing the generated OTP code.
	 * @throws ForbiddenException if the user is not authorized for SHOP access.
	 */
	async otpHandler(data: SendOtpDto): Promise<string> {
		// Find the user by phone and ensure SHOP is one of their allowed apps
		const user = await this.getUser(data.phone, EUserApp.SHOP);

		// Reject if no eligible user is found
		if (!user) {
			throw new ForbiddenException('You do not have permission to access this resource.');
		}

		// Generate and store OTP for the authorized user
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
		const user = await this.getUser(data.phone, EUserApp.STORE);
		// If user is not found, throw an unauthorized exception
		if (!user) {
			throw new UnauthorizedException('Invalid credentials');
		}

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
}
