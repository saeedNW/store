import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class RequestEmailChangeDto {
	@ApiProperty({ description: 'New email address', example: 'user@example.com' })
	@IsNotEmpty()
	@IsEmail()
	@Expose()
	email: string;
}

export class VerifyEmailChangeDto {
	@ApiProperty({ description: 'Verification code', example: 'FC2F99' })
	@IsNotEmpty()
	@IsString()
	@Expose()
	code: string;
}
