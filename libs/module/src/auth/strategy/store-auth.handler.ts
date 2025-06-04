import { Injectable } from '@nestjs/common';
import { BaseAuthHandler } from './base-auth.handler';
import { IStrategyHandler } from '../interfaces/strategy.interface';
import { SendOtpDto } from '../dto/send-otp.dto';
import { EUserApp } from '@common/enums';

/**
 * Authentication handler for the "STORE" user application.
 * Handles both existing and new users, allowing new users to be created during OTP handling.
 */
@Injectable()
export class StoreAuthHandler extends BaseAuthHandler implements IStrategyHandler {
	/**
	 * Determines whether this handler can process requests for the given phone number
	 * within the context of the STORE application.
	 *
	 * @param {string} phone - The user's phone number.
	 * @returns {Promise<boolean>} - True if the user doesn't exist or is allowed to access STORE.
	 */
	async canHandle(phone: string): Promise<boolean> {
		// Check if STORE is a configured issuer
		if (!this.authOptions.issuer.includes(EUserApp.STORE)) return false;

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
	async otpHandler(data: SendOtpDto): Promise<string> {
		// Attempt to find user by phone
		let user = await this.userRepository.findOneBy({ phone: data.phone });

		// If user doesn't exist, create a new one
		if (!user) {
			user = await this.userRepository.save({ phone: data.phone });
		}

		// Generate and return OTP
		return this.generateAndStoreOtp(user.id);
	}
}
