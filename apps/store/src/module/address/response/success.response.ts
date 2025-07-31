import { CreateApiBaseResponse, OkApiBaseResponse } from '@common/abstracts/base.response';
import { ApiProperty } from '@nestjs/swagger';

export class GetAddressesSuccess extends OkApiBaseResponse {
	@ApiProperty({
		description: 'Response data',
		example: {
			addresses: [
				{
					id: 'ac3d3f14-4211-4411-a7dc-e64fe9956b10',
					created_at: '2025-07-20T12:03:38.514Z',
					updated_at: '2025-07-20T12:03:38.514Z',
					title: 'Home',
					province: 'Tehran',
					city: 'Tehran',
					address: 'No. 123, Main Street',
					postal_code: '1234567890',
					is_default: true,
					location: {
						type: 'Point',
						coordinates: [51.5074, -0.1278],
					},
				},
			],
		},
	})
	data: {
		addresses: {
			id: string;
			created_at: string;
			updated_at: string;
			title: string;
			province: string;
			city: string;
			address: string;
			postal_code: string;
			is_default: boolean;
			location: {
				type: string;
				coordinates: number[];
			};
		}[];
	};
}

export class GetAddressSuccess extends OkApiBaseResponse {
	@ApiProperty({
		description: 'Response data',
		example: {
			address: {
				id: 'ac3d3f14-4211-4411-a7dc-e64fe9956b10',
				created_at: '2025-07-20T12:03:38.514Z',
				updated_at: '2025-07-20T12:03:38.514Z',
				title: 'Home',
				province: 'Tehran',
				city: 'Tehran',
				address: 'No. 123, Main Street',
				postal_code: '1234567890',
				is_default: true,
				location: {
					type: 'Point',
					coordinates: [51.5074, -0.1278],
				},
			},
		},
	})
	data: {
		address: {
			id: string;
			created_at: string;
			updated_at: string;
			title: string;
			province: string;
			city: string;
			address: string;
			postal_code: string;
			is_default: boolean;
			location: {
				type: string;
				coordinates: number[];
			};
		};
	};
}

export class CreateAddressSuccess extends CreateApiBaseResponse {
	@ApiProperty({
		description: 'Response data',
		example: {
			address: {
				id: 'ac3d3f14-4211-4411-a7dc-e64fe9956b10',
				created_at: '2025-07-20T12:03:38.514Z',
				updated_at: '2025-07-20T12:03:38.514Z',
				title: 'Home',
				province: 'Tehran',
				city: 'Tehran',
				address: 'No. 123, Main Street',
				postal_code: '1234567890',
				is_default: true,
				location: {
					type: 'Point',
					coordinates: [51.5074, -0.1278],
				},
			},
		},
	})
	data: {
		address: {
			id: string;
			created_at: string;
			updated_at: string;
			title: string;
			province: string;
			city: string;
			address: string;
			postal_code: string;
			is_default: boolean;
			location: {
				type: string;
				coordinates: number[];
			};
		};
	};
}

export class UpdateAddressSuccess extends OkApiBaseResponse {
	@ApiProperty({
		description: 'Response data',
		example: {
			address: {
				id: 'ac3d3f14-4211-4411-a7dc-e64fe9956b10',
				created_at: '2025-07-20T12:03:38.514Z',
				updated_at: '2025-07-20T14:46:42.568Z',
				title: 'Work',
				province: 'Tehran',
				city: 'Tehran',
				address: 'No. 456, Business Street',
				postal_code: '9876543210',
				is_default: false,
				location: {
					type: 'Point',
					coordinates: [51.5074, -0.1278],
				},
			},
		},
	})
	data: {
		address: {
			id: string;
			created_at: string;
			updated_at: string;
			title: string;
			province: string;
			city: string;
			address: string;
			postal_code: string;
			is_default: boolean;
			location: {
				type: string;
				coordinates: number[];
			};
		};
	};
}

export class DeleteAddressSuccess extends OkApiBaseResponse {}

export class SetDefaultAddressSuccess extends OkApiBaseResponse {}
