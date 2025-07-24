import { CustomLoggerService } from './logger.service';

/**
 * Overrides native `console` methods in production environments
 * to use the `CustomLoggerService` for structured JSON logging.
 */
if (process.env.NODE_ENV === 'production') {
	// Instantiate the custom logger
	const logger = new CustomLoggerService();

	/**
	 * Override console.log with structured logging
	 * @param {any} message - The main message to log
	 * @param {any[]} optionalParams - Any additional context parameters
	 */
	console.log = (message?: any, ...optionalParams: any[]): void => {
		logger.log(message, optionalParams.join(' - '));
	};

	/**
	 * Override console.error with structured error logging
	 * @param {any} message - The main error message
	 * @param {any[]} optionalParams - Optional parameters, often stack traces or context
	 */
	console.error = (message?: any, ...optionalParams: any[]): void => {
		logger.error(message, optionalParams.join(' - '));
	};

	/**
	 * Override console.warn with structured warning logging
	 * @param {any} message - The warning message
	 * @param {any[]} optionalParams - Additional context parameters
	 */
	console.warn = (message?: any, ...optionalParams: any[]): void => {
		logger.warn(message, optionalParams.join(' - '));
	};

	/**
	 * Override console.debug with structured debug logging
	 * @param {any} message - The debug message
	 * @param {any[]} optionalParams - Additional context parameters
	 */
	console.debug = (message?: any, ...optionalParams: any[]): void => {
		logger.debug(message, optionalParams.join(' - '));
	};
}
