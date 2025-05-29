import { LoggerService, LogLevel, Injectable } from '@nestjs/common';

@Injectable()
export class CustomLoggerService implements LoggerService {
	private context?: string;
	private readonly pid = process.pid;
	private readonly logLevels: LogLevel[];

	constructor(logLevels: LogLevel[] = ['log', 'error', 'warn', 'debug', 'verbose']) {
		this.logLevels = logLevels;
	}

	setContext(context: string) {
		this.context = context;
	}

	private getTimestamp() {
		return {
			iso: new Date().toISOString(),
			unix: Date.now(),
		};
	}

	private formatLog(level: LogLevel, message: any, context?: string, trace?: string) {
		return JSON.stringify({
			timestamp: this.getTimestamp(),
			level,
			pid: this.pid,
			context: context || this.context,
			message: typeof message === 'string' ? message : JSON.stringify(message),
			trace: trace || undefined,
		});
	}

	private write(level: LogLevel, message: any, context?: string, trace?: string) {
		if (!this.logLevels.includes(level)) return;

		const formatted = this.formatLog(level, message, context, trace);

		switch (level) {
			case 'error':
				console.error(formatted);
				break;
			case 'warn':
				console.warn(formatted);
				break;
			case 'log':
				console.log(formatted);
				break;
			case 'debug':
				console.debug(formatted);
				break;
			case 'verbose':
				console.info(formatted);
				break;
		}
	}

	log(message: any, context?: string) {
		this.write('log', message, context);
	}

	error(message: any, trace?: string, context?: string) {
		this.write('error', message, context, trace);
	}

	warn(message: any, context?: string) {
		this.write('warn', message, context);
	}

	debug(message: any, context?: string) {
		this.write('debug', message, context);
	}

	verbose(message: any, context?: string) {
		this.write('verbose', message, context);
	}
}
