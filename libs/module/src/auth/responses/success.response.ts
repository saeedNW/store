import { CreateApiBaseResponse, OkApiBaseResponse } from '@common/abstracts/base.response';
import { ApiProperty } from '@nestjs/swagger';

export class LogOutSuccess extends CreateApiBaseResponse {}
export class RevokeSessionSuccess extends CreateApiBaseResponse {}
export class ResetPassVerifySuccess extends CreateApiBaseResponse {}
export class ResetPassSuccess extends CreateApiBaseResponse {}

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

export class GetActiveSessionsSuccess extends OkApiBaseResponse {
	@ApiProperty({
		description: 'Response data',
		example: {
			sessions: [
				{
					sessionId: '9bbb41cf-9d08-4ee0-8397-f48681f163bc',
					meta: {
						createdAt: 1749141963354,
						userAgent:
							'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
						ip: '::1',
					},
				},
				{
					sessionId: 'd324710c-a4b7-4022-9292-d7091696e3e5',
					meta: {
						createdAt: 1749142776822,
						userAgent:
							'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
						ip: '::1',
					},
				},
				{
					sessionId: 'c2e87dbb-99f7-4157-a93e-49f66c320d25',
					meta: {
						createdAt: 1749146511774,
						userAgent:
							'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
						ip: '::1',
					},
				},
			],
		},
	})
	data: {
		sessions: {
			sessionId: string;
			meta: {
				createdAt: number;
				userAgent: string;
				ip: string;
			};
		}[];
	};
}
