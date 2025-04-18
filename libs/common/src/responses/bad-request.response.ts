import { FailureApiBaseResponse } from '@common/abstracts/base.response';
import { ApiProperty } from '@nestjs/swagger';

/**
 * API process bad request swagger response
 */
export class BadRequestResponse extends FailureApiBaseResponse {
	@ApiProperty({
		description: 'Response status code',
		example: 400,
	})
	statusCode: number;
}
