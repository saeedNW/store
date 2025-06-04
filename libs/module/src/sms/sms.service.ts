import { Inject, Injectable } from '@nestjs/common';
import { SmsStrategy } from './interfaces/strategy.interface';

/**
 * Service for sending SMS messages
 */
@Injectable()
export class SmsService {
	/**
	 * Constructor for SmsService
	 * @param smsStrategy - The SMS strategy to use for sending messages
	 */
	constructor(@Inject('SmsStrategy') private readonly smsStrategy: SmsStrategy) {}

	/**
	 * Sends an OTP code to the specified phone number
	 * @param phone - The phone number to send the OTP to
	 * @param code - The OTP code to send
	 * @returns {Promise<void>} - A promise that resolves when the SMS is sent
	 */
	async sendOtp(phone: string, code: string): Promise<void> {
		if (process.env.NODE_ENV !== 'production') {
			return;
		}

		return this.smsStrategy.sendOtp(phone, code);
	}
}
