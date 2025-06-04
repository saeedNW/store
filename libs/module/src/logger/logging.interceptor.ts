// src/logger/logging.interceptor.ts
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, catchError, tap } from 'rxjs';
import { Request, Response } from 'express';
import { throwError } from 'rxjs';
import { CustomLoggerService } from './logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	constructor(private readonly logger: CustomLoggerService) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		if (process.env.NODE_ENV !== 'production') {
			return next.handle();
		}

		const now = Date.now();
		const ctx = context.switchToHttp();
		const req = ctx.getRequest<Request & { user?: any }>();
		const method = req.method;
		const url = req.url;
		const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
		const userAgent = req.headers['user-agent'];
		const authHeader = req.headers['authorization'];
		const body = req.body;
		const query = req.query;
		const params = req.params;

		return next.handle().pipe(
			tap(() => {
				const res = ctx.getResponse<Response>();
				this.logger.log(
					{
						type: 'HTTP Request',
						method,
						url,
						statusCode: res.statusCode,
						responseTime: `${Date.now() - now}ms`,
						ip,
						authHeader,
						userAgent,
						query,
						body,
						params,
						user: (req as any).user?.id || 'guest',
					},
					'HTTP',
				);
			}),
			catchError((err) => {
				const res = ctx.getResponse();
				this.logger.error(
					{
						type: 'HTTP Error',
						method,
						url,
						statusCode: res?.statusCode ?? err?.status ?? 500,
						responseTime: `${Date.now() - now}ms`,
						ip,
						userAgent,
						authHeader,
						query,
						body,
						params,
						user: (req as any).user?.id || 'guest',
						errorMessage: err.message,
						stack: err.stack,
					},
					'HTTP',
				);
				return throwError(() => err as Error);
			}),
		);
	}
}
