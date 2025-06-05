import { CreateApiBaseResponse } from '@common/abstracts/base.response';
import { ApiProperty } from '@nestjs/swagger';

export class SendOtpSuccess extends CreateApiBaseResponse {
	@ApiProperty({
		description: 'Response data (Development Environment Only)',
		example: { otp: '78363' },
	})
	data: { otp: string };
}

export class CheckOtpSuccess extends CreateApiBaseResponse {
	@ApiProperty({
		description: 'Response data',
		example: { accessToken: 'JWT Token', refreshToken: 'JWT Token' },
	})
	data: { accessToken: string; refreshToken: string };
}

export class RefreshTokenSuccess extends CreateApiBaseResponse {
	@ApiProperty({
		description: 'Response data',
		example: { accessToken: 'JWT Token', refreshToken: 'JWT Token' },
	})
	data: { accessToken: string; refreshToken: string };
}
