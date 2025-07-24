import { LoggerService, LogLevel, Injectable } from '@nestjs/common';

/**
 * A custom implementation of NestJS's `LoggerService` that outputs logs in JSON format.
 * Allows for filtering log levels and setting a context for all log entries.
 */
@Injectable()
export class CustomLoggerService implements LoggerService {
	/**
	 * Optional context string that provides additional information about the log source.
	 */
	private context?: string;

	/**
	 * Process ID of the current Node.js process.
	 */
	private readonly pid = process.pid;

	/**
	 * Array of active log levels. Only these levels will be logged.
	 */
	private readonly logLevels: LogLevel[];

	/**
	 * Initializes the logger with a set of allowed log levels.
	 *
	 * @param {LogLevel[]} logLevels - Array of log levels to be enabled. Defaults to ['log', 'error', 'warn', 'debug'].
	 */
	constructor(logLevels: LogLevel[] = ['log', 'error', 'warn', 'debug']) {
		this.logLevels = logLevels;
	}

	/**
	 * Sets a logging context that will be included in all future log entries.
	 *
	 * @param {string} context - A string to identify the logging source.
	 */
	setContext(context: string): void {
		this.context = context;
	}

	/**
	 * Returns the current timestamp in both ISO and Unix format.
	 *
	 * @returns {object} - An object with ISO and Unix timestamps.
	 */
	private getTimestamp(): object {
		return {
			iso: new Date().toISOString(),
			unix: Date.now(),
		};
	}

	/**
	 * Formats a log entry into a JSON string.
	 *
	 * @param {LogLevel} level - Log level (log, error, warn, debug).
	 * @param {any} message - The message to log.
	 * @param {string} context - Optional override of the default context.
	 * @param {string} trace - Optional stack trace for error logs.
	 * @returns {string} - A JSON-formatted string containing log details.
	 */
	private formatLog(level: LogLevel, message: any, context?: string, trace?: string): string {
		return JSON.stringify({
			timestamp: this.getTimestamp(),
			level,
			pid: this.pid,
			context: context || this.context,
			message: typeof message === 'string' ? message : JSON.stringify(message),
			trace: trace || undefined,
		});
	}

	/**
	 * Writes the formatted log message to stdout if the log level is enabled.
	 *
	 * @param {LogLevel} level - Log level.
	 * @param {any} message - The message to log.
	 * @param {string} context - Optional context for this specific log entry.
	 * @param {string} trace - Optional error stack trace.
	 */
	private write(level: LogLevel, message: any, context?: string, trace?: string): void {
		if (!this.logLevels.includes(level)) return;

		const jsonFormatLog = this.formatLog(level, message, context, trace);
		process.stdout.write(jsonFormatLog + '\n');
	}

	/**
	 * Logs a standard message at the 'log' level.
	 *
	 * @param {any} message - The message to log.
	 * @param {string} context - Optional context for this specific log entry.
	 */
	log(message: any, context?: string): void {
		this.write('log', message, context);
	}

	/**
	 * Logs an error message at the 'error' level, with optional stack trace.
	 *
	 * @param {any} message - The error message to log.
	 * @param {string} trace - Optional stack trace associated with the error.
	 * @param {string} context - Optional context for this specific log entry.
	 */
	error(message: any, trace?: string, context?: string): void {
		this.write('error', message, context, trace);
	}

	/**
	 * Logs a warning message at the 'warn' level.
	 *
	 * @param {any} message - The warning message to log.
	 * @param {string} context - Optional context for this specific log entry.
	 */
	warn(message: any, context?: string): void {
		this.write('warn', message, context);
	}

	/**
	 * Logs a debug message at the 'debug' level.
	 *
	 * @param {any} message - The debug message to log.
	 * @param {string} context - Optional context for this specific log entry.
	 */
	debug(message: any, context?: string): void {
		this.write('debug', message, context);
	}
}
