import {
	ApiBadRequestResponse,
	ApiCreatedResponse,
	ApiForbiddenResponse,
	ApiInternalServerErrorResponse,
	ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { SendOtpSuccess } from './success.response';
import {
	BadRequestResponse,
	InternalServerErrorResponse,
	UnprocessableEntityResponse,
	ForbiddenResponse,
} from '@common/responses';

export function SendOtpResponses() {
	return function (
		target: Record<string, any>,
		propertyKey: string,
		descriptor: PropertyDescriptor,
	) {
		ApiCreatedResponse({
			description: 'Success Response',
			type: SendOtpSuccess,
		})(target, propertyKey, descriptor);

		ApiBadRequestResponse({
			description: 'Bad Request Response',
			type: BadRequestResponse,
		})(target, propertyKey, descriptor);

		ApiForbiddenResponse({
			description: 'Forbidden Response',
			type: ForbiddenResponse,
		})(target, propertyKey, descriptor);

		ApiUnprocessableEntityResponse({
			description: 'Unprocessable Entity Response',
			type: UnprocessableEntityResponse,
		})(target, propertyKey, descriptor);

		ApiInternalServerErrorResponse({
			description: 'Internal Server Error',
			type: InternalServerErrorResponse,
		})(target, propertyKey, descriptor);
	};
}
