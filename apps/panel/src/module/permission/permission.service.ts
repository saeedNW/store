import { EPermissionApps } from '@common/enums';
import { PermissionEntity } from '@database/postgres/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

@Injectable()
export class PermissionService {
	constructor(
		@InjectRepository(PermissionEntity)
		private permissionRepository: Repository<PermissionEntity>,
	) {}

	/**
	 * Retrieves all permissions associated with the PANEL application
	 * or global (null) permissions, then groups them by type (bundle vs. endpoint).
	 *
	 * @returns An object containing permissions grouped by category:
	 * - `bundle`: permissions that represent a pack or collection
	 * - `endpoint`: permissions that represent a single endpoint
	 */
	async getPanelPermissions() {
		// Fetch permissions
		const permissions = await this.permissionRepository.find({
			where: [{ app: EPermissionApps.PANEL }, { app: IsNull() }],
		});

		// Group permissions into "bundle" (packs of permissions) or "endpoint" (individual actions).
		const groupedPermissions = permissions.reduce(
			(acc, perm) => {
				const key = perm.isPack ? 'bundle' : 'endpoint';
				if (!acc[key]) {
					acc[key] = [];
				}
				acc[key].push(perm);
				return acc;
			},
			{} as Record<string, typeof permissions>,
		);

		return { permissions: groupedPermissions };
	}
}
