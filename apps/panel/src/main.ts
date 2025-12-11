import { swaggerConfiguration } from '@common/config';
import { AllExceptionFilter } from '@common/filters';
import { ResponseTransformerInterceptor } from '@common/interceptor';
import { UnprocessableEntityPipe } from '@common/pipe';
import { AppLogger, LoggingInterceptor, RequestContextMiddleware } from '@modules/logger';
import { initializeConsoleOverrides } from '@modules/logger/console-overrides';
import { ExceptionFilter, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { getCorsConfig, helmetConfig } from '@security';
import { CustomHeadersInterceptor } from '@security/custom-headers.Interceptor';
import { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
	// Create a new instance of the Nest application
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		bufferLogs: true, // Buffer logs until logger is ready
	});

	// Get logger services
	const appLogger = app.get(AppLogger);
	const requestContextMiddleware = app.get(RequestContextMiddleware);
	const loggingInterceptor = app.get(LoggingInterceptor);

	// Replace NestJS default logger with Winston-based AppLogger
	app.useLogger(appLogger);

	// Initialize console overrides to route all console.* calls through Winston
	// This must be done early, before other modules start logging
	initializeConsoleOverrides(appLogger);

	// Register request context middleware FIRST to establish request context for all subsequent operations
	app.use((req: Request, res: Response, next: NextFunction) => {
		requestContextMiddleware.use(req, res, next);
	});
	// Register assets folder as static files directory
	app.useStaticAssets('assets');
	// Apply CORS config
	app.enableCors(getCorsConfig(['*']));
	// Secure the app with Helmet
	app.use(helmet(helmetConfig));
	// Set global prefix for all routes
	app.setGlobalPrefix('/api');
	// Enable API versioning
	app.enableVersioning({
		type: VersioningType.URI,
		defaultVersion: '1',
	});
	// Initialize swagger
	swaggerConfiguration(app, 'Panel API');
	// initialize custom interceptors
	app.useGlobalInterceptors(
		loggingInterceptor,
		new CustomHeadersInterceptor(),
		new ResponseTransformerInterceptor(),
	);
	// Initialize custom exception filter
	app.useGlobalFilters(new AllExceptionFilter() as ExceptionFilter);
	// Initialize custom validation pipe
	app.useGlobalPipes(new UnprocessableEntityPipe() as ValidationPipe);
	// Starting server
	await app.listen(process.env.PANEL_PORT || 3001, () => {
		console.log(`Server is running on PORT ${process.env.PANEL_PORT || 3001}`);
	});
}
bootstrap().catch((err) => console.error(err));
