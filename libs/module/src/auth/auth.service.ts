import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { SendOtpDto } from './dto/send-otp.dto';
import { IStrategyHandler } from './interfaces/strategy.interface';
import { SmsService } from '@modules/sms';
import { CheckOtpDto } from './dto/check-otp.dto';
import { plainToClass } from 'class-transformer';

/**
 * Core service responsible for handling OTP-based authentication.
 * Delegates logic to appropriate strategy handlers based on phone number and app context.
 */
@Injectable()
export class AuthService {
	constructor(
		@Inject('STRATEGY_HANDLERS') private readonly handlers: IStrategyHandler[],
		private readonly smsService: SmsService,
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
		const otp = await strategy.handler.otpHandler(sendOtpDto);

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
	 * Identifies which strategy handler can process the given phone number.
	 *
	 * @param {string} phone - The user's phone number.
	 * @returns {Promise<{ handler: IStrategyHandler; canHandle: boolean }>} - An object containing the handler and its eligibility status.
	 * @throws BadRequestException if no handler can process the phone number.
	 */
	private async getHandler(
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
}
