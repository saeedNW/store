import { getEnvVariable } from '@common/utilities/functions';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export const getCorsConfig: CorsOptions = {
	origin: getEnvVariable('CORS_ORIGIN').split(','), // Restrict origins (use env variable)
	methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // OPTIONS is automatically handled
	allowedHeaders: ['Content-Type', 'Authorization'], // Restrict headers
	credentials: true, // Allow cookies, but only if origin is not "*"
	preflightContinue: false, // Automatically handle preflight requests
	optionsSuccessStatus: 204, // Respond with 204 for preflight requests (improves performance)
};
