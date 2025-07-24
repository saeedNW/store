import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { SmsStrategy } from '../interfaces/strategy.interface';
import { getEnvVariable } from '@common/utilities/functions';

/**
 * SMS.ir implementation of the SMS strategy
 */
@Injectable()
export class SmsIrStrategy implements SmsStrategy {
	/**
	 * Constructor for SmsIrStrategy
	 * @param {HttpService} httpService - The HttpService for making HTTP requests
	 */
	constructor(private readonly httpService: HttpService) {}

	/**
	 * API key for SMS.ir service
	 * @private
	 */
	private readonly apiKey: string = getEnvVariable('SMS_IR_API_KEY');

	/**
	 * SMS.ir send URL endpoint
	 * @private
	 */
	private readonly sendUrl: string = getEnvVariable('SMS_IR_SEND_URL');

	/**
	 * Sends an OTP code to the specified phone number using SMS.ir service
	 * @param {string} phone - The recipient's phone number
	 * @param {string} code - The OTP code to send
	 * @returns {Promise<void>} - A promise that resolves when the SMS is sent
	 * @throws {InternalServerErrorException} - If the SMS fails to send
	 */
	async sendOtp(phone: string, code: string): Promise<void> {
		try {
			// Prepare the data for the request
			const data = {
				mobile: phone,
				templateId: 895752,
				parameters: [
					{
						name: 'Code',
						value: code,
					},
				],
			};

			// Prepare the headers for the request
			const headers = {
				'Content-Type': 'application/json',
				Accept: 'text/plain',
				'x-api-key': this.apiKey,
			};

			// Send the request to SMS.ir
			const request = this.httpService.post(this.sendUrl, data, { headers });

			// Wait for the response
			await lastValueFrom(request);
		} catch (error) {
			const errorMessage = error.response?.data?.message || error.message;
			throw new InternalServerErrorException(`Failed to send OTP via SMS.ir: ${errorMessage}`);
		}
	}
}
