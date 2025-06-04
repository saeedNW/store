import { ForbiddenException, Injectable } from '@nestjs/common';
import { BaseAuthHandler } from './base-auth.handler';
import { IStrategyHandler } from '../interfaces/strategy.interface';
import { SendOtpDto } from '../dto/send-otp.dto';
import { EUserApp } from '@common/enums';

/**
 * Authentication handler for the "SHOP" user application.
 * Implements logic for verifying SHOP users and generating OTPs.
 */
@Injectable()
export class ShopAuthHandler extends BaseAuthHandler implements IStrategyHandler {
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
		const user = await this.userRepository
			.createQueryBuilder('user')
			.where('user.phone = :phone', { phone: data.phone })
			.andWhere(':app = ANY(user.allowedApps)', { app: EUserApp.SHOP })
			.getOne();

		// Reject if no eligible user is found
		if (!user) {
			throw new ForbiddenException('You do not have permission to access this resource.');
		}

		// Generate and store OTP for the authorized user
		return this.generateAndStoreOtp(user.id);
	}
}
