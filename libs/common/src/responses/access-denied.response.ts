import { FailureApiBaseResponse } from '@common/abstracts/base.response';
import { ApiProperty } from '@nestjs/swagger';

/**
 * API process access denied swagger response
 */
export class AccessDeniedResponse extends FailureApiBaseResponse {
	@ApiProperty({
		description: 'Response status code',
		example: 403,
	})
	statusCode: number;
}
