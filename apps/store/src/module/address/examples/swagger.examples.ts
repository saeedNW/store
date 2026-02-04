export const AddressSwaggerExample = {
	create: {
		default: {
			summary: 'Create default address',
			description: 'payload required to create a default address',
			value: {
				title: 'Home',
				province: 'Tehran',
				city: 'Tehran',
				address: '123 Main St',
				postal_code: 123456,
				is_default: true,
				latitude: 35.7152,
				longitude: 51.4043,
			},
		},
		general: {
			summary: 'Create general address',
			description: 'payload required to create a general address',
			value: {
				title: 'Home',
				province: 'Tehran',
				city: 'Tehran',
				address: '123 Main St',
				postal_code: 123456,
				is_default: false,
				latitude: 35.7152,
				longitude: 51.4043,
			},
		},
	},
};
