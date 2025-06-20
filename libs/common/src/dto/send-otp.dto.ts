import { fixNumbers } from '@common/utilities/sanitizer';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsPhoneNumber } from 'class-validator';

export class SendOtpDto {
	@ApiProperty({
		description: 'User phone number',
		example: '09121234567',
	})
	@Transform(({ value }: { value: string }) => fixNumbers(value))
	@IsPhoneNumber('IR', { message: 'Invalid phone number' })
	@Expose()
	phone: string;
}
