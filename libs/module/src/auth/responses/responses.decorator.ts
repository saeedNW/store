import {
	ApiBadRequestResponse,
	ApiCreatedResponse,
	ApiForbiddenResponse,
	ApiInternalServerErrorResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiUnauthorizedResponse,
	ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import {
	CheckOtpSuccess,
	GetActiveSessionsSuccess,
	LogOutSuccess,
	RefreshTokenSuccess,
	ResetPassSuccess,
	ResetPassVerifySuccess,
	RevokeSessionSuccess,
	SendOtpSuccess,
} from './success.response';
import {
	BadRequestResponse,
	InternalServerErrorResponse,
	UnprocessableEntityResponse,
	ForbiddenResponse,
	UnauthorizedResponse,
	NotFoundResponse,
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

export function CheckOtpResponses() {
	return function (
		target: Record<string, any>,
		propertyKey: string,
		descriptor: PropertyDescriptor,
	) {
		ApiCreatedResponse({
			description: 'Success Response',
			type: CheckOtpSuccess,
		})(target, propertyKey, descriptor);

		ApiBadRequestResponse({
			description: 'Bad Request Response',
			type: BadRequestResponse,
		})(target, propertyKey, descriptor);

		ApiUnauthorizedResponse({
			description: 'Unauthorized Response',
			type: UnauthorizedResponse,
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

export function RefreshTokenResponses() {
	return function (
		target: Record<string, any>,
		propertyKey: string,
		descriptor: PropertyDescriptor,
	) {
		ApiCreatedResponse({
			description: 'Success Response',
			type: RefreshTokenSuccess,
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

export function GetActiveSessionsResponses() {
	return function (
		target: Record<string, any>,
		propertyKey: string,
		descriptor: PropertyDescriptor,
	) {
		ApiOkResponse({
			description: 'Success Response',
			type: GetActiveSessionsSuccess,
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

export function LogOutResponses() {
	return function (
		target: Record<string, any>,
		propertyKey: string,
		descriptor: PropertyDescriptor,
	) {
		ApiCreatedResponse({
			description: 'Success Response',
			type: LogOutSuccess,
		})(target, propertyKey, descriptor);

		ApiUnauthorizedResponse({
			description: 'Unauthorized Response',
			type: UnauthorizedResponse,
		})(target, propertyKey, descriptor);

		ApiNotFoundResponse({
			description: 'Not Found Response',
			type: NotFoundResponse,
		})(target, propertyKey, descriptor);

		ApiInternalServerErrorResponse({
			description: 'Internal Server Error',
			type: InternalServerErrorResponse,
		})(target, propertyKey, descriptor);
	};
}

export function RevokeTokensResponses() {
	return function (
		target: Record<string, any>,
		propertyKey: string,
		descriptor: PropertyDescriptor,
	) {
		ApiCreatedResponse({
			description: 'Success Response',
			type: RevokeSessionSuccess,
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
			description: 'Not Found Response',
			type: NotFoundResponse,
		})(target, propertyKey, descriptor);

		ApiInternalServerErrorResponse({
			description: 'Internal Server Error',
			type: InternalServerErrorResponse,
		})(target, propertyKey, descriptor);
	};
}

export function RevokeSessionResponses() {
	return function (
		target: Record<string, any>,
		propertyKey: string,
		descriptor: PropertyDescriptor,
	) {
		ApiCreatedResponse({
			description: 'Success Response',
			type: RevokeSessionSuccess,
		})(target, propertyKey, descriptor);

		ApiUnauthorizedResponse({
			description: 'Unauthorized Response',
			type: UnauthorizedResponse,
		})(target, propertyKey, descriptor);

		ApiNotFoundResponse({
			description: 'Not Found Response',
			type: NotFoundResponse,
		})(target, propertyKey, descriptor);

		ApiInternalServerErrorResponse({
			description: 'Internal Server Error',
			type: InternalServerErrorResponse,
		})(target, propertyKey, descriptor);
	};
}

export function ResetPassVerifyResponses() {
	return function (
		target: Record<string, any>,
		propertyKey: string,
		descriptor: PropertyDescriptor,
	) {
		ApiCreatedResponse({
			description: 'Success Response',
			type: ResetPassVerifySuccess,
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

export function ResetPassResponses() {
	return function (
		target: Record<string, any>,
		propertyKey: string,
		descriptor: PropertyDescriptor,
	) {
		ApiCreatedResponse({
			description: 'Success Response',
			type: ResetPassSuccess,
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
