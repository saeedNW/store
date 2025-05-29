import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getCorsConfig, helmetConfig } from '@security';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ExceptionFilter, NestInterceptor, ValidationPipe } from '@nestjs/common';
import { ResponseTransformerInterceptor } from '@common/interceptor';
import { HttpExceptionFilter } from '@common/filters';
import { UnprocessableEntityPipe } from '@common/pipe';
import { customHeadersMiddleware } from '@common/middlewares';
import { swaggerConfiguration } from '@common/config';
import { CustomLoggerService, LoggingInterceptor } from '@modules/logger';

async function bootstrap() {
	// Create a new instance of the CustomLoggerService
	const logger = new CustomLoggerService();
	// Create a new instance of the Nest application
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		bufferLogs: true,
		logger,
	});
	// Register custom logging interceptor
	app.useGlobalInterceptors(new LoggingInterceptor(logger));
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
	swaggerConfiguration(app, 'Panel API');
	// Initialize custom response interceptor
	app.useGlobalInterceptors(new ResponseTransformerInterceptor() as NestInterceptor);
	// Initialize custom exception filter
	app.useGlobalFilters(new HttpExceptionFilter() as ExceptionFilter);
	// Initialize custom validation pipe
	app.useGlobalPipes(new UnprocessableEntityPipe() as ValidationPipe);
	// Starting server
	await app.listen(process.env.PANEL_PORT || 3001, () => {
		console.log(`Server is running on PORT ${process.env.PANEL_PORT || 3001}`);
	});
}
bootstrap().catch((err) => console.error(err));
