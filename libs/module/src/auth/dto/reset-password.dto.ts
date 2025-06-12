import { ValidateConfirmedPassword } from '@common/decorators';
import { fixNumbers } from '@common/utilities/sanitizer';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsNotEmpty, IsPhoneNumber, IsString, Matches, MinLength } from 'class-validator';

export class ResetPasswordDto {
	@ApiProperty({
		description: 'User phone number',
		example: '09121234567',
	})
	@IsPhoneNumber('IR', { message: 'Invalid phone number' })
	@Transform(({ value }: { value: string }) => fixNumbers(value))
	@Expose()
	phone: string;

	@ApiProperty({
		description: 'User new password',
		example: 'Password123!',
	})
	@IsString()
	@IsNotEmpty()
	@MinLength(8, { message: 'Password must be at least 8 characters long' })
	@Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
		message:
			'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
	})
	@Expose()
	newPassword: string;

	@ApiProperty({
		description: 'User confirm password',
		example: 'Password123!',
	})
	@IsString()
	@IsNotEmpty()
	@ValidateConfirmedPassword('newPassword')
	@Expose()
	confirmPassword: string;
}
