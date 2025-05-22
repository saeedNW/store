// email.module.ts
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { EmailService } from './email.service';
import { MailtrapStrategy } from './strategies/mailtrap.strategy';

@Module({
	imports: [
		ConfigModule,
		MailerModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				transport: {
					host: configService.get<string>('MAILTRAP_HOST'),
					port: 2525,
					auth: {
						user: configService.get<string>('MAILTRAP_USER'),
						pass: configService.get<string>('MAILTRAP_PASS'),
					},
				},
				defaults: {
					from: '"No Reply" <no-reply@example.com>',
				},
			}),
		}),
	],
	providers: [
		{
			provide: 'EmailStrategy',
			useClass: MailtrapStrategy,
		},
		EmailService,
	],
	exports: [EmailService],
})
export class EmailModule {}
