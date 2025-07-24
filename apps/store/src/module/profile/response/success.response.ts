import { OkApiBaseResponse } from '@common/abstracts/base.response';
import { ApiProperty } from '@nestjs/swagger';

export class RequestEmailChangeSuccess extends OkApiBaseResponse {}
export class VerifyEmailChangeSuccess extends OkApiBaseResponse {}
export class DeleteProfileAvatarSuccess extends OkApiBaseResponse {}

export class GetProfileSuccess extends OkApiBaseResponse {
	@ApiProperty({
		description: 'Response data',
		example: {
			profile: {
				id: 'ac3d3f14-4211-4411-a7dc-e64fe9956b10',
				created_at: '2025-07-20T12:03:38.514Z',
				updated_at: '2025-07-20T12:03:38.514Z',
				username: '09121234567',
				first_name: 'Saeed',
				last_name: 'Norouzi',
				profile_image: null,
				birthday: null,
				email: null,
			},
		},
	})
	data: {
		profile: {
			id: string;
			created_at: string;
			updated_at: string;
			username: string;
			first_name: string | null;
			last_name: string | null;
			profile_image: string | null;
			birthday: Date | null;
			email: string | null;
		};
	};
}

export class UpdateProfileSuccess extends OkApiBaseResponse {
	@ApiProperty({
		description: 'Response data',
		example: {
			profile: {
				id: 'ac3d3f14-4211-4411-a7dc-e64fe9956b10',
				created_at: '2025-07-20T12:03:38.514Z',
				updated_at: '2025-07-20T14:46:42.568Z',
				username: 'JohnDoe',
				first_name: 'John',
				last_name: 'Doe',
				profile_image: null,
				birthday: '2000-01-01',
				email: null,
			},
		},
	})
	data: {
		profile: {
			id: string;
			created_at: string;
			updated_at: string;
			username: string;
			first_name: string | null;
			last_name: string | null;
			profile_image: string | null;
			birthday: Date | null;
			email: string | null;
		};
	};
}

export class UpdateProfileAvatarSuccess extends OkApiBaseResponse {
	@ApiProperty({
		description: 'Response data',
		example: {
			avatar: '/path/to/avatar.jpg',
		},
	})
	data: {
		avatar: string;
	};
}
