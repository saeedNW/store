import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to modify response headers
 */
export function customHeadersMiddleware(req: Request, res: Response, next: NextFunction) {
	res.setHeader('X-Powered-By', 'Python 3.13.2'); // Fake the tech stack
	res.setHeader('Server', 'Gunicorn/20.1.0'); // Mimic a Python server
	next();
}
