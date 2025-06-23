import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { getCorsConfig, helmetConfig } from '@security';
import helmet from 'helmet';
import { customHeadersMiddleware } from '@common/middlewares';
import { swaggerConfiguration } from '@common/config';
import { ResponseTransformerInterceptor } from '@common/interceptor';
import { ExceptionFilter, NestInterceptor, ValidationPipe } from '@nestjs/common';
import { AllExceptionFilter } from '@common/filters';
import { UnprocessableEntityPipe } from '@common/pipe';
import { CustomLoggerService, LoggingInterceptor } from '@modules/logger';

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
	app.enableCors(getCorsConfig);
	// Secure the app with Helmet
	app.use(helmet(helmetConfig));
	// Manually set custom headers for X-Powered-By and server
	app.use(customHeadersMiddleware);
	// Set global prefix for all routes
	app.setGlobalPrefix('/api');
	// Initialize swagger
	swaggerConfiguration(app, 'shop panel API');
	// Initialize custom response interceptor
	app.useGlobalInterceptors(new ResponseTransformerInterceptor() as NestInterceptor);
	// Initialize custom exception filter
	app.useGlobalFilters(new AllExceptionFilter() as ExceptionFilter);
	// Initialize custom validation pipe
	app.useGlobalPipes(new UnprocessableEntityPipe() as ValidationPipe);
	// Starting server
	await app.listen(process.env.SHOP_PORT || 3002, () => {
		console.log(`Server is running on PORT ${process.env.SHOP_PORT || 3002}`);
	});
}
bootstrap().catch((err) => console.error(err));
