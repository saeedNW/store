import { fixNumbers } from '@common/utilities/sanitizer';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class LoginDto {
	@ApiProperty({
		description: 'User phone number',
		example: '09121234567',
	})
	@Transform(({ value }: { value: string }) => fixNumbers(value))
	@IsPhoneNumber('IR', { message: 'Invalid phone number' })
	@Expose()
	phone: string;

	@ApiProperty({
		description: 'User password',
		example: 'Password123!',
	})
	@IsString()
	@IsNotEmpty()
	@Expose()
	password: string;
}
