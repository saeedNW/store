import { FailureApiBaseResponse } from '@common/abstracts/base.response';
import { ApiProperty } from '@nestjs/swagger';

/**
 * API process unprocessable entity swagger response
 */
export class UnprocessableEntityResponse extends FailureApiBaseResponse {
	@ApiProperty({
		description: 'Response status code',
		example: 422,
	})
	statusCode: number;

	@ApiProperty({
		description: 'Response message',
		example: ['Validation Error #1', 'Validation Error #2'],
	})
	declare message: [string];
}
