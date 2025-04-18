import { FailureApiBaseResponse } from '@common/abstracts/base.response';
import { ApiProperty } from '@nestjs/swagger';

/**
 * API process result not found swagger response
 */
export class NotFoundResponse extends FailureApiBaseResponse {
	@ApiProperty({
		description: 'Response status code',
		example: 404,
	})
	statusCode: number;
}
