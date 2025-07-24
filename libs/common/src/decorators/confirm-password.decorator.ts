import {
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface,
	ValidationOptions,
	registerDecorator,
} from 'class-validator';

/**
 * Validator constraint that checks if a confirmation field matches the original field.
 * Typically used to ensure a 'confirmPassword' field matches 'password'.
 */
@ValidatorConstraint({ name: 'ConfirmedPassword', async: false })
export class ConfirmedPasswordConstraint implements ValidatorConstraintInterface {
	/**
	 * Checks if the value matches the referenced property on the object.
	 *
	 * @param value - The value of the property being validated (e.g., confirmPassword).
	 * @param args - Contains validation metadata, including the object and constraints.
	 * @returns `true` if the value matches the referenced property, `false` otherwise.
	 */
	validate(value: any, args: ValidationArguments): boolean {
		const [relatedPropertyName] = args.constraints;
		const relatedValue = (args.object as Record<string, any>)[relatedPropertyName];
		return value === relatedValue;
	}

	/**
	 * Returns the error message when validation fails.
	 *
	 * @param {ValidationArguments} args - Validation arguments.
	 * @returns {string} - A user-friendly error message.
	 */
	defaultMessage(args: ValidationArguments): string {
		const customMessage = args.constraints[1] as string;
		return customMessage ?? `${args.property} must match ${args.constraints[0]}.`;
	}
}

/**
 * Decorator to validate that the decorated property matches another property on the same object.
 * Commonly used for confirming passwords.
 *
 * @param {string} property - The name of the property to match (e.g., 'password').
 * @param {string | ((args: ValidationArguments) => string)} message - Optional custom error message or a function to generate it dynamically.
 * @param {ValidationOptions} validationOptions - Additional class-validator options.
 * @returns {PropertyDecorator} - A property decorator.
 *
 * @example
 * ```ts
 * class RegisterDto {
 *   password: string;
 *
 *   @ValidateConfirmedPassword('password', 'Passwords do not match')
 *   confirmPassword: string;
 * }
 * ```
 */
export function ValidateConfirmedPassword(
	property: string,
	message?: string | ((args: ValidationArguments) => string),
	validationOptions?: ValidationOptions,
): PropertyDecorator {
	return (target: object, propertyName: string | symbol) => {
		registerDecorator({
			target: target.constructor,
			propertyName: propertyName.toString(),
			options: validationOptions,
			constraints: [property, message],
			validator: ConfirmedPasswordConstraint,
		});
	};
}
