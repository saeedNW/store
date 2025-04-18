import { FailureApiBaseResponse } from '@common/abstracts/base.response';
import { ApiProperty } from '@nestjs/swagger';

/**
 * APi process conflict swagger response
 */
export class ConflictResponse extends FailureApiBaseResponse {
	@ApiProperty({
		description: 'Response status code',
		example: 409,
	})
	statusCode: number;
}
