import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Response } from 'express';

interface ResponseData {
	message?: string;
	[key: string]: any;
}

@Injectable()
export class ResponseTransformerInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
		// Switch to HTTP context
		const ctx = context.switchToHttp();
		// Get the response object from context
		const response = ctx.getResponse<Response>();
		// Get the status code from the response object
		const statusCode: number = response.statusCode;

		/**
		 * Handle the request and return the response object.
		 */
		return next.handle().pipe(
			map((data: ResponseData) => {
				// Explicitly type `data`
				// Return a simple text response if data was a string
				if (typeof data === 'string') {
					return {
						statusCode,
						success: true,
						message: data,
					};
				}

				// Set the default message
				let message: string = 'Process completed successfully';

				// Check if the data object has a message property
				if (data && typeof data === 'object' && data?.message) {
					message = data.message;
					delete data.message;
				}

				// Return the response object
				return {
					statusCode,
					success: true,
					message,
					data: Object.keys(data).length ? data : {},
				};
			}),
		);
	}
}
