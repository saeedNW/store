import { ApiProperty } from '@nestjs/swagger';

/**
 * A base response type class for FAILURE responses to be used in order to make
 * the subclasses code cleaner and easier to maintain
 */
export class FailureApiBaseResponse {
	@ApiProperty({
		description: 'Response message',
		example: 'Process error message',
	})
	message: string | Array<string>;
	/**
	 * Typically, the `message` property is a single string. However, for validation errors,
	 * it may be an array of strings to capture multiple validation messages.
	 *
	 * In validation-related subclasses, be sure to redeclare the `message` property using the `override`
	 * keyword to specify the expected type, such as `Array<string>`.
	 */

	@ApiProperty({
		description: 'Response timestamp',
		example: new Date(),
	})
	timestamp: Date;

	@ApiProperty({
		description: 'Process result type',
		example: false,
	})
	success: boolean;
}

/**
 * A base response type class for OK responses to be used in order to make
 * the subclasses code cleaner and easier to maintain
 */
export class OkApiBaseResponse {
	@ApiProperty({
		description: 'Response status code',
		example: 200,
	})
	statusCode: number;

	@ApiProperty({
		description: 'Process result type',
		example: true,
	})
	success: boolean;

	@ApiProperty({
		description: 'Response message',
		example: 'Process success message',
	})
	message: string;
}

/**
 * A base response type class for CREATED responses to be used in order to make
 * the subclasses code cleaner and easier to maintain
 */
export class CreateApiBaseResponse extends OkApiBaseResponse {
	@ApiProperty({
		description: 'Response status code',
		example: 201,
	})
	declare statusCode: number;
}
