import { AuthGuard } from '@modules/auth/guard/auth.guard';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

/**
 * Create a custom decorator to combine multiply guard related decorator
 * in a single decorator in order to make the controller code cleaner and
 * easier to maintain.
 */
export function AuthDecorator() {
	return applyDecorators(UseGuards(AuthGuard), ApiBearerAuth('Authorization'));
}
