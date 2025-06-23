import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Request } from 'express';

/**
 * AuthGuard is a custom guard that protects routes by validating a Bearer access token.
 * It extracts the token from the Authorization header, verifies its validity via AuthService,
 * and attaches the user ID to the request object for downstream use.
 */
@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private authService: AuthService) {}

	/**
	 * Determines whether the current request is authorized by validating the access token.
	 *
	 * @param {ExecutionContext} context - The execution context containing the HTTP request.
	 * @returns {Promise<boolean>} - A promise that resolves to true if the token is valid; otherwise, throws an exception.
	 * @throws {UnauthorizedException} If the token is missing, invalid, or verification fails.
	 */
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const httpContext = context.switchToHttp();
		const request: Request = httpContext.getRequest<Request>();

		// Extract the Bearer token from the Authorization header
		const token: string = this.extractToken(request);

		// Validate the token and attach the resulting user ID to the request object
		request.userId = await this.authService.validateAccessToken(token);

		return true;
	}

	/**
	 * Extracts the Bearer token from the Authorization header of the request.
	 *
	 * @param {Request} request - The incoming HTTP request.
	 * @returns {string} - The extracted token as a string.
	 * @throws {UnauthorizedException} If the header is missing, empty, or not a Bearer token.
	 */
	private extractToken(request: Request): string {
		const { authorization } = request.headers;

		// Ensure the Authorization header exists and is not empty
		if (!authorization || authorization.trim() === '') {
			throw new UnauthorizedException('Missing or invalid Authorization header');
		}

		// Ensure the token follows the Bearer schema
		if (!authorization.startsWith('Bearer ')) {
			throw new UnauthorizedException('Missing or invalid Authorization header');
		}

		// Return the token portion after "Bearer "
		const token = authorization.split(' ')[1];
		return token;
	}
}
