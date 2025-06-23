// src/logger/logging.interceptor.ts
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, catchError, tap } from 'rxjs';
import { Request, Response } from 'express';
import { throwError } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	constructor() {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const now = Date.now();
		const ctx = context.switchToHttp();
		const req = ctx.getRequest<Request>();
		const res = ctx.getResponse<Response>();
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
				if (process.env.NODE_ENV === 'production') {
					console.log(
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
							user: req.userId || 'guest',
						},
						'HTTP',
					);
				} else {
					console.log({
						type: 'HTTP Request',
						method,
						url,
						statusCode: res.statusCode,
						responseTime: `${Date.now() - now}ms`,
					});
				}
			}),
			catchError((err) => {
				if (process.env.NODE_ENV === 'production') {
					console.error(
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
							user: req.userId || 'guest',
							errorMessage: err.message,
							stack: err.stack,
						},
						'HTTP',
					);
				} else {
					console.error({
						type: 'HTTP Error',
						method,
						url,
						statusCode: res?.statusCode ?? err?.status ?? 500,
						responseTime: `${Date.now() - now}ms`,
						stack: err.stack,
					});
				}
				return throwError(() => err as Error);
			}),
		);
	}
}
