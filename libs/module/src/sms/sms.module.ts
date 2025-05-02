import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { SmsIrStrategy } from './strategies/smsir.strategy';
import { HttpModule } from '@nestjs/axios';

@Module({
	imports: [
		HttpModule.register({
			maxRedirects: 5,
			timeout: 5000,
		}),
	],
	providers: [
		{
			provide: 'SmsStrategy',
			useClass: SmsIrStrategy,
		},
		SmsService,
	],
	exports: [SmsService],
})
export class SmsModule {}
