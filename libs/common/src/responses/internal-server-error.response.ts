import { FailureApiBaseResponse } from '@common/abstracts/base.response';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Internal server error swagger response
 */
export class InternalServerErrorResponse extends FailureApiBaseResponse {
	@ApiProperty({
		description: 'Response status code',
		example: 500,
	})
	statusCode: number;
}
