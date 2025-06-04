import { ForbiddenException, Injectable } from '@nestjs/common';
import { BaseAuthHandler } from './base-auth.handler';
import { IStrategyHandler } from '../interfaces/strategy.interface';
import { SendOtpDto } from '../dto/send-otp.dto';
import { EUserApp } from '@common/enums';

/**
 * Authentication handler for the "PANEL" user application.
 * Implements logic specific to verifying access and generating OTPs for PANEL users.
 */
@Injectable()
export class PanelAuthHandler extends BaseAuthHandler implements IStrategyHandler {
	/**
	 * Determines whether this handler can handle authentication for the given phone number.
	 * It checks if the auth options allow PANEL and if the user exists and is allowed to access PANEL.
	 *
	 * @param {string} phone - The phone number of the user to check.
	 * @returns {Promise<boolean>} - A boolean indicating whether the handler can process this request.
	 * @throws ForbiddenException if the user does not exist or lacks access to PANEL.
	 */
	async canHandle(phone: string): Promise<boolean> {
		// Check if PANEL is a supported issuer
		if (!this.authOptions.issuer.includes(EUserApp.PANEL)) return false;

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
	 * Verifies user existence and access rights before generating a new OTP.
	 *
	 * @param {SendOtpDto} data - Data transfer object containing the phone number.
	 * @returns {Promise<string>} - The newly generated OTP code as a string.
	 * @throws ForbiddenException if the user is not authorized for PANEL access.
	 */
	async otpHandler(data: SendOtpDto): Promise<string> {
		// Query for a user that matches the given phone number and has PANEL access
		const user = await this.userRepository
			.createQueryBuilder('user')
			.where('user.phone = :phone', { phone: data.phone })
			.andWhere(':app = ANY(user.allowedApps)', { app: EUserApp.PANEL })
			.getOne();

		// Deny access if the user doesn't exist or isn't allowed to access PANEL
		if (!user) {
			throw new ForbiddenException('You do not have permission to access this resource.');
		}

		// Generate and store a new OTP for the user
		return this.generateAndStoreOtp(user.id);
	}
}
