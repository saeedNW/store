import { CustomLoggerService } from './logger.service';

if (process.env.NODE_ENV === 'production') {
	const logger = new CustomLoggerService();

	console.log = (message?: any, ...optionalParams: any[]) => {
		logger.log(message, optionalParams.join(' - '));
	};

	console.error = (message?: any, ...optionalParams: any[]) => {
		logger.error(message, optionalParams.join(' - '));
	};

	console.warn = (message?: any, ...optionalParams: any[]) => {
		logger.warn(message, optionalParams.join(' - '));
	};

	console.debug = (message?: any, ...optionalParams: any[]) => {
		logger.debug(message, optionalParams.join(' - '));
	};
}
