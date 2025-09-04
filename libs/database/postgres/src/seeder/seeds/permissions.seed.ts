import { EPermissionApps } from '@common/enums';

/**
 * Structure of a permission seed entry.
 *
 * - `name`: the unique permission identifier
 * - `description`: human-readable description
 * - `app`: optional, indicates which app this permission belongs to
 */
interface PermissionSeedEntry {
	name: string;
	description: string;
	isPack?: boolean;
	app?: EPermissionApps | null;
}

/**
 * Helper to strongly type permission entries
 * while preserving literal types for `name`.
 */
function definePermissions<T extends readonly PermissionSeedEntry[]>(entries: T) {
	return entries;
}

/**
 * Seed data for permissions.
 *
 * This array defines all permissions available in the system.
 * It is used by:
 * - The database seeder to populate the permissions table
 * - The `EPermissions` constant to provide enum-like access
 *
 * Each entry is strongly typed, so editors will provide autocomplete
 * for `name`, `description`, and `app` when adding new permissions.
 */
export const permissionsSeed = definePermissions([
	// System Full Access
	{
		name: 'full_access',
		description: 'Full access to the system',
		app: null,
		isPack: true,
	},
	//? START: Admin Panel Permissions
	{
		name: 'address_management',
		description: 'full access to address endpoints',
		app: EPermissionApps.PANEL,
		isPack: true,
	},
	{
		name: 'address_get_all',
		description: 'Get all addresses associated with a user',
		app: EPermissionApps.PANEL,
	},
	{
		name: 'address_get_one',
		description: 'Get single address data',
		app: EPermissionApps.PANEL,
	},
	{
		name: 'address_create',
		description: 'Create new address',
		app: EPermissionApps.PANEL,
	},
	{
		name: 'address_update',
		description: 'Update an specific address',
		app: EPermissionApps.PANEL,
	},
	{
		name: 'address_delete',
		description: 'Remove an specific address',
		app: EPermissionApps.PANEL,
	},
	{
		name: 'profile_management',
		description: 'Full access to profile endpoints',
		app: EPermissionApps.PANEL,
		isPack: true,
	},
	{
		name: 'profile_get',
		description: "Retrieve user's profile",
		app: EPermissionApps.PANEL,
	},
	{
		name: 'profile_update',
		description: "Update user's profile",
		app: EPermissionApps.PANEL,
	},
	{
		name: 'profile_remove_avatar',
		description: "Remove user's profile avatar",
		app: EPermissionApps.PANEL,
	},
	{
		name: 'permissions_get_all',
		description: 'Get all permissions related to ',
		app: EPermissionApps.PANEL,
	},
	//? START: Shop Panel Permissions
	{
		name: 'permissions_get_all',
		description: 'Get all permissions related to shop',
		app: EPermissionApps.SHOP,
	},
] as const);
