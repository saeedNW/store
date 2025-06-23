import { ValidateConfirmedPassword } from '@common/decorators';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class UpdatePasswordDto {
	@ApiPropertyOptional({
		description: 'Optional only for the first time, due to empty password field',
	})
	@IsOptional()
	@IsString()
	@Expose()
	currentPassword: string;

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
