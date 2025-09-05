import { swaggerConfiguration } from '@common/config';
import { AllExceptionFilter } from '@common/filters';
import { ResponseTransformerInterceptor } from '@common/interceptor';
import { customHeadersMiddleware } from '@common/middlewares';
import { UnprocessableEntityPipe } from '@common/pipe';
import { CustomLoggerService, LoggingInterceptor } from '@modules/logger';
import { ExceptionFilter, NestInterceptor, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { getCorsConfig, helmetConfig } from '@security';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
	// Create a new instance of the Nest application
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		bufferLogs: true,
		logger: process.env.NODE_ENV === 'production' ? new CustomLoggerService() : undefined,
	});
	// Register custom logging interceptor
	app.useGlobalInterceptors(new LoggingInterceptor());
	// Register assets folder as static files directory
	app.useStaticAssets('assets');
	// Apply CORS config
	app.enableCors(getCorsConfig(['*']));
	// Secure the app with Helmet
	app.use(helmet(helmetConfig));
	// Manually set custom headers for X-Powered-By and server
	app.use(customHeadersMiddleware);
	// Set global prefix for all routes
	app.setGlobalPrefix('/api');
	// Enable API versioning
	app.enableVersioning({
		type: VersioningType.URI,
		defaultVersion: '1',
	});
	// Initialize swagger
	swaggerConfiguration(app, 'Store API');
	// Initialize custom response interceptor
	app.useGlobalInterceptors(new ResponseTransformerInterceptor() as NestInterceptor);
	// Initialize custom exception filter
	app.useGlobalFilters(new AllExceptionFilter() as ExceptionFilter);
	// Initialize custom validation pipe
	app.useGlobalPipes(new UnprocessableEntityPipe() as ValidationPipe);
	// Starting server
	await app.listen(process.env.STORE_PORT || 3000, () => {
		console.log(`Server is running on PORT ${process.env.STORE_PORT || 3000}`);
	});
}
bootstrap().catch((err) => console.log(err));
