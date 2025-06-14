import { EPermissionApps } from '@common/enums';

export const permissionsSeed = [
	{
		name: 'full_access',
		description: 'Full access to the system',
	},
	{
		name: 'permissions_get_all',
		description: 'Get all permissions',
		app: EPermissionApps.PANEL,
	},
	{
		name: 'permissions_get_all',
		description: 'Get all permissions related to shop',
		app: EPermissionApps.SHOP,
	},
];
