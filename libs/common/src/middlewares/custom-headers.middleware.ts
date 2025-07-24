import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to modify response headers
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function.
 */
export function customHeadersMiddleware(req: Request, res: Response, next: NextFunction): void {
	res.setHeader('X-Powered-By', 'Python 3.13.2'); // Fake the tech stack
	res.setHeader('Server', 'Gunicorn/20.1.0'); // Mimic a Python server
	next();
}
