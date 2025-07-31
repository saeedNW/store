import {
	ApiBadRequestResponse,
	ApiCreatedResponse,
	ApiInternalServerErrorResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiUnauthorizedResponse,
	ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import {
	GetAddressesSuccess,
	GetAddressSuccess,
	CreateAddressSuccess,
	UpdateAddressSuccess,
	DeleteAddressSuccess,
	SetDefaultAddressSuccess,
} from './success.response';
import {
	InternalServerErrorResponse,
	NotFoundResponse,
	UnauthorizedResponse,
	UnprocessableEntityResponse,
	BadRequestResponse,
} from '@common/responses';

export function GetAddressesResponses() {
	return function (
		target: Record<string, any>,
		propertyKey: string,
		descriptor: PropertyDescriptor,
	) {
		ApiOkResponse({
			description: 'Success Response',
			type: GetAddressesSuccess,
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

export function GetAddressResponses() {
	return function (
		target: Record<string, any>,
		propertyKey: string,
		descriptor: PropertyDescriptor,
	) {
		ApiOkResponse({
			description: 'Success Response',
			type: GetAddressSuccess,
		})(target, propertyKey, descriptor);

		ApiUnauthorizedResponse({
			description: 'Unauthorized Response',
			type: UnauthorizedResponse,
		})(target, propertyKey, descriptor);

		ApiNotFoundResponse({
			description: 'Not found Response',
			type: NotFoundResponse,
		})(target, propertyKey, descriptor);

		ApiInternalServerErrorResponse({
			description: 'Internal Server Error',
			type: InternalServerErrorResponse,
		})(target, propertyKey, descriptor);
	};
}

export function CreateAddressResponses() {
	return function (
		target: Record<string, any>,
		propertyKey: string,
		descriptor: PropertyDescriptor,
	) {
		ApiCreatedResponse({
			description: 'Address created successfully',
			type: CreateAddressSuccess,
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

export function UpdateAddressResponses() {
	return function (
		target: Record<string, any>,
		propertyKey: string,
		descriptor: PropertyDescriptor,
	) {
		ApiOkResponse({
			description: 'Address updated successfully',
			type: UpdateAddressSuccess,
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

export function DeleteAddressResponses() {
	return function (
		target: Record<string, any>,
		propertyKey: string,
		descriptor: PropertyDescriptor,
	) {
		ApiOkResponse({
			description: 'Address deleted successfully',
			type: DeleteAddressSuccess,
		})(target, propertyKey, descriptor);

		ApiUnauthorizedResponse({
			description: 'Unauthorized Response',
			type: UnauthorizedResponse,
		})(target, propertyKey, descriptor);

		ApiNotFoundResponse({
			description: 'Not found Response',
			type: NotFoundResponse,
		})(target, propertyKey, descriptor);

		ApiInternalServerErrorResponse({
			description: 'Internal Server Error',
			type: InternalServerErrorResponse,
		})(target, propertyKey, descriptor);
	};
}

export function SetDefaultAddressResponses() {
	return function (
		target: Record<string, any>,
		propertyKey: string,
		descriptor: PropertyDescriptor,
	) {
		ApiOkResponse({
			description: 'Address set as default successfully',
			type: SetDefaultAddressSuccess,
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

		ApiInternalServerErrorResponse({
			description: 'Internal Server Error',
			type: InternalServerErrorResponse,
		})(target, propertyKey, descriptor);
	};
}
