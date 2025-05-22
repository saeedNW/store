// mailtrap-email.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailStrategy } from '../interfaces/strategy.interface';

@Injectable()
export class MailtrapStrategy implements EmailStrategy {
	/**
	 * Constructor for MailtrapStrategy
	 * @param mailerService - mailer module main service
	 */
	constructor(private readonly mailerService: MailerService) {}

	/**
	 * Sends an OTP code to the specified email address using Mailtrap service
	 * @param to - email address of the recipient
	 * @param code - verification code
	 */
	async sendVerificationEmail(to: string, code: string): Promise<void> {
		try {
			await this.mailerService.sendMail({
				to,
				subject: 'OTP verification code',
				html: `<p>Your verification code: <b style='color:blue;'>${code}</b></p>`,
			});
		} catch (error) {
			throw new InternalServerErrorException(
				'MAILTRAP: ' + error.response?.data?.message || error.message,
			);
		}
	}
}
