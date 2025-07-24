// src/logger/logging.interceptor.ts

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, catchError, tap } from 'rxjs';
import { Request, Response } from 'express';
import { throwError } from 'rxjs';

/**
 * An HTTP request/response interceptor that logs request details and errors.
 * Logging is environment-aware: detailed logs appear only in production.
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	constructor() {}

	/**
	 * Intercepts HTTP requests and responses for logging purposes.
	 *
	 * @param {ExecutionContext} context - Provides access to the current request context.
	 * @param {CallHandler} next - The next handler in the request lifecycle.
	 * @returns {Observable<any>} - An observable that logs the request on completion or error.
	 * @throws {Error} - If the request fails.
	 */
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		// Capture the start time for measuring response duration
		const now = Date.now();

		// Switch to HTTP context to access request and response objects
		const ctx = context.switchToHttp();
		const req = ctx.getRequest<Request>();
		const res = ctx.getResponse<Response>();

		// Extract useful metadata from the request
		const method = req.method;
		const url = req.url;
		const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
		const userAgent = req.headers['user-agent'];
		const authHeader = req.headers['authorization'];
		const body = req.body;
		const query = req.query;
		const params = req.params;

		// Handle the request and attach side-effects (logging)
		return next.handle().pipe(
			tap(() => {
				// Log the request once it successfully completes
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
							user: req.userId || 'guest', // Optionally include authenticated user
						},
						'HTTP', // Optional context string
					);
				} else {
					// Minimal logging in non-production environments
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
				// Log any error that occurs during request processing
				if (process.env.NODE_ENV === 'production') {
					console.error(
						{
							type: 'HTTP Error',
							method,
							url,
							statusCode: err?.status ?? 500,
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
						'HTTP', // Optional context string
					);
				} else {
					console.error({
						type: 'HTTP Error',
						method,
						url,
						statusCode: err?.status ?? 500,
						responseTime: `${Date.now() - now}ms`,
						stack: err.stack,
					});
				}

				// Forward the error for further handling by NestJS
				return throwError(() => err as Error);
			}),
		);
	}
}
