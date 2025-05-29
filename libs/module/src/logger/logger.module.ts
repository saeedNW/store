// src/logger/logger.module.ts
import { Global, Module } from '@nestjs/common';
import { CustomLoggerService } from './logger.service';

@Global()
@Module({
	providers: [
		{
			provide: CustomLoggerService,
			useFactory: () => new CustomLoggerService(),
		},
	],
	exports: [CustomLoggerService],
})
export class LoggerModule {}
