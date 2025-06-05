import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Custom parameter decorator to extract the Bearer token from the Authorization header of an HTTP request.
 *
 * This decorator can be used in NestJS controllers to easily retrieve the JWT or any bearer token
 * from the `Authorization` header without manually parsing it each time.
 *
 * @example
 * ```typescript
 * @Get()
 * someMethod(@Token() token: string | null) {
 *   console.log(token);
 * }
 * ```
 *
 * @param data - Optional data passed to the decorator (not used here).
 * @param ctx - The execution context of the current request.
 * @returns The extracted token as a string if present and valid, otherwise null.
 */
export const Token = createParamDecorator((data: unknown, ctx: ExecutionContext): string | null => {
	// Get the HTTP request object from the execution context
	const request = ctx.switchToHttp().getRequest();

	// Retrieve the Authorization header (case insensitive)
	const authHeader = request.headers['authorization'] || request.headers['Authorization'];

	// Return null if no Authorization header is found
	if (!authHeader) {
		return null;
	}

	// Split the header value to extract the type and token
	const [type, token] = authHeader.split(' ');

	// Check if the type is 'Bearer' and token exists; otherwise return null
	if (type !== 'Bearer' || !token) {
		return null;
	}

	// Return the token string
	return token as string;
});
