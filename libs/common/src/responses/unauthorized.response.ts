import { FailureApiBaseResponse } from '@common/abstracts/base.response';
import { ApiProperty } from '@nestjs/swagger';

/**
 * API process unauthorized swagger response
 */
export class UnauthorizedResponse extends FailureApiBaseResponse {
	@ApiProperty({
		description: 'Response status code',
		example: 401,
	})
	statusCode: number;
}
