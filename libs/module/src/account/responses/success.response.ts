import { CreateApiBaseResponse, OkApiBaseResponse } from '@common/abstracts/base.response';
import { UserEntity } from '@database/postgres/entities';
import { ApiProperty } from '@nestjs/swagger';

export class PhoneVerificationSuccess extends OkApiBaseResponse {}
export class UpdatePasswordSuccess extends OkApiBaseResponse {}

export class RetrieveAccountSuccess extends OkApiBaseResponse {
	@ApiProperty({
		description: 'Response data',
		example: {
			account: {
				id: 'e008d46e-a357-4a23-8725-726533b4afa3',
				created_at: '2025-06-05T02:40:30.082Z',
				updated_at: '2025-06-23T07:04:56.936Z',
				phone: '09121234567',
				verify_phone: true,
			},
		},
	})
	data: {
		account: Partial<UserEntity>;
	};
}

export class PhoneOtpRequestSuccess extends CreateApiBaseResponse {
	@ApiProperty({
		description: 'Response data (Development Environment Only)',
		example: { otp: '78363' },
	})
	data: { otp: string };
}
