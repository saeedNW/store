// email.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { EmailStrategy } from './interfaces/strategy.interface';

@Injectable()
export class EmailService {
	/**
	 * Constructor for EmailService
	 * @param {EmailStrategy} emailStrategy - The email strategy to use for sending emails
	 */
	constructor(@Inject('EmailStrategy') private readonly emailStrategy: EmailStrategy) {}

	/**
	 * Sends a verification email to the specified email address
	 * @param {string} to - The email address of the recipient
	 * @param {string} code - The verification code to send
	 * @returns {Promise<void>} - A promise that resolves when the email is sent.
	 * @throws {InternalServerErrorException} - If the email fails to send.
	 */
	async sendVerificationEmail(to: string, code: string): Promise<void> {
		return this.emailStrategy.sendVerificationEmail(to, code);
	}
}
