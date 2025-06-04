import { fixNumbers } from '@common/utilities/sanitizer';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsNumberString, IsPhoneNumber, Length } from 'class-validator';

export class CheckOtpDto {
	@ApiProperty({
		description: 'User phone number',
		example: '09121234567',
	})
	@Transform(({ value }: { value: string }) => fixNumbers(value))
	@IsPhoneNumber('IR', { message: 'Invalid phone number' })
	@Expose()
	phone: string;

	@ApiProperty({
		description: 'The OTP code',
		example: '32452',
	})
	@Transform(({ value }: { value: string }) => fixNumbers(value))
	@IsNumberString()
	@Length(5, 5, { message: 'Invalid OTP code' })
	@Expose()
	otp: string;
}
