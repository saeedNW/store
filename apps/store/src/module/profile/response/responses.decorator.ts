import {
	ApiBadRequestResponse,
	ApiConflictResponse,
	ApiInternalServerErrorResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiUnauthorizedResponse,
	ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import {
	GetProfileSuccess,
	RequestEmailChangeSuccess,
	UpdateProfileSuccess,
	VerifyEmailChangeSuccess,
} from './success.response';
import {
	InternalServerErrorResponse,
	NotFoundResponse,
	UnauthorizedResponse,
	UnprocessableEntityResponse,
	BadRequestResponse,
	ConflictResponse,
} from '@common/responses';

export function GetProfileResponses() {
	return function (
		target: Record<string, any>,
		propertyKey: string,
		descriptor: PropertyDescriptor,
	) {
		ApiOkResponse({
			description: 'Success Response',
			type: GetProfileSuccess,
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

export function UpdateProfileResponses() {
	return function (
		target: Record<string, any>,
		propertyKey: string,
		descriptor: PropertyDescriptor,
	) {
		ApiOkResponse({
			description: 'Success Response',
			type: UpdateProfileSuccess,
		})(target, propertyKey, descriptor);

		ApiUnauthorizedResponse({
			description: 'Unauthorized Response',
			type: UnauthorizedResponse,
		})(target, propertyKey, descriptor);

		ApiNotFoundResponse({
			description: 'Not fund Response',
			type: NotFoundResponse,
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

export function RequestEmailChangeResponses() {
	return function (
		target: Record<string, any>,
		propertyKey: string,
		descriptor: PropertyDescriptor,
	) {
		ApiOkResponse({
			description: 'Verification code sent to new email address',
			type: RequestEmailChangeSuccess,
		})(target, propertyKey, descriptor);

		ApiBadRequestResponse({
			description: 'Bad Request Response',
			type: BadRequestResponse,
		})(target, propertyKey, descriptor);

		ApiUnauthorizedResponse({
			description: 'Unauthorized Response',
			type: UnauthorizedResponse,
		})(target, propertyKey, descriptor);

		ApiNotFoundResponse({
			description: 'Not found Response',
			type: NotFoundResponse,
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

export function VerifyEmailChangeResponses() {
	return function (
		target: Record<string, any>,
		propertyKey: string,
		descriptor: PropertyDescriptor,
	) {
		ApiOkResponse({
			description: 'Email address updated and verified successfully',
			type: VerifyEmailChangeSuccess,
		})(target, propertyKey, descriptor);

		ApiBadRequestResponse({
			description: 'Bad Request Response',
			type: BadRequestResponse,
		})(target, propertyKey, descriptor);

		ApiUnauthorizedResponse({
			description: 'Unauthorized Response',
			type: UnauthorizedResponse,
		})(target, propertyKey, descriptor);

		ApiNotFoundResponse({
			description: 'Not found Response',
			type: NotFoundResponse,
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
