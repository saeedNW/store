import {
	ApiBadRequestResponse,
	ApiConflictResponse,
	ApiCreatedResponse,
	ApiInternalServerErrorResponse,
	ApiOkResponse,
	ApiUnauthorizedResponse,
	ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import {
	BadRequestResponse,
	InternalServerErrorResponse,
	UnprocessableEntityResponse,
	UnauthorizedResponse,
	ConflictResponse,
} from '@common/responses';
import {
	PhoneOtpRequestSuccess,
	PhoneVerificationSuccess,
	RetrieveAccountSuccess,
	UpdatePasswordSuccess,
} from './success.response';

export function RetrieveAccountResponses() {
	return function (
		target: Record<string, any>,
		propertyKey: string,
		descriptor: PropertyDescriptor,
	) {
		ApiOkResponse({
			description: 'Success Response',
			type: RetrieveAccountSuccess,
		})(target, propertyKey, descriptor);

		ApiUnauthorizedResponse({
			description: 'Unauthorized Response',
			type: UnauthorizedResponse,
		})(target, propertyKey, descriptor);

		ApiInternalServerErrorResponse({
			description: 'Internal Server Error',
			type: InternalServerErrorResponse,
		})(target, propertyKey, descriptor);
	};
}

export function PhoneOtpRequestResponses() {
	return function (
		target: Record<string, any>,
		propertyKey: string,
		descriptor: PropertyDescriptor,
	) {
		ApiCreatedResponse({
			description: 'Success Response',
			type: PhoneOtpRequestSuccess,
		})(target, propertyKey, descriptor);

		ApiBadRequestResponse({
			description: 'Bad Request Response',
			type: BadRequestResponse,
		})(target, propertyKey, descriptor);

		ApiUnauthorizedResponse({
			description: 'Unauthorized Response',
			type: UnauthorizedResponse,
		})(target, propertyKey, descriptor);

		ApiConflictResponse({
			description: 'Conflict Response',
			type: ConflictResponse,
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

export function PhoneVerificationResponses() {
	return function (
		target: Record<string, any>,
		propertyKey: string,
		descriptor: PropertyDescriptor,
	) {
		ApiOkResponse({
			description: 'Success Response',
			type: PhoneVerificationSuccess,
		})(target, propertyKey, descriptor);

		ApiBadRequestResponse({
			description: 'Bad Request Response',
			type: BadRequestResponse,
		})(target, propertyKey, descriptor);

		ApiUnauthorizedResponse({
			description: 'Unauthorized Response',
			type: UnauthorizedResponse,
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

export function UpdatePasswordResponses() {
	return function (
		target: Record<string, any>,
		propertyKey: string,
		descriptor: PropertyDescriptor,
	) {
		ApiOkResponse({
			description: 'Success Response',
			type: UpdatePasswordSuccess,
		})(target, propertyKey, descriptor);

		ApiBadRequestResponse({
			description: 'Bad Request Response',
			type: BadRequestResponse,
		})(target, propertyKey, descriptor);

		ApiUnauthorizedResponse({
			description: 'Unauthorized Response',
			type: UnauthorizedResponse,
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
