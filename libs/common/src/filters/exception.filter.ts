import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

/**
 * Implement custom response logic for exceptions.
 * This filter will change the application exception
 * response structure before sending it to client
 */
@Catch()
export class AllExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		// Get the response object from context
		const response = host.switchToHttp().getResponse<Response>();
		// Retrieve the exception's status code
		const statusCode: number =
			exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
		// Retrieve the exception's message
		const exceptionResponse: string | object | undefined =
			exception instanceof HttpException ? exception.getResponse() : undefined;

		// Retrieve the exception's response message
		const message =
			typeof exceptionResponse === 'string'
				? exceptionResponse
				: typeof exceptionResponse === 'object'
					? (exceptionResponse as { message?: string }).message || ''
					: 'An unexpected error occurred. Please contact the support team.';

		// Send the response`
		response.status(statusCode).json({
			statusCode,
			success: false,
			message,
			timestamp: new Date().toISOString(),
		});
	}
}
