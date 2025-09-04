import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { PermissionEntity } from '../entities';
import { permissionsSeed } from './seeds/permissions.seed';

/**
 * SeederService is responsible for seeding initial data into the database
 * when the application boots up.
 */
@Injectable()
export class SeederService implements OnApplicationBootstrap {
	constructor(
		@InjectRepository(PermissionEntity)
		private readonly permissionRepository: Repository<PermissionEntity>,
	) {}

	/**
	 * Lifecycle hook that is triggered once the application has fully bootstrapped.
	 */
	async onApplicationBootstrap() {
		await this.seedPermissions();
	}

	/**
	 * Seeds the permissions into the database using a predefined list (permissionsSeed).
	 * Also removes any permissions from the database that are not present in the seed data.
	 */
	private async seedPermissions() {
		const permissions = permissionsSeed;

		// Keep track of all seed permission identifiers (name + app) -  (undefined mapped to null)
		const seedKeys = permissions.map(
			(p) => `${p.name}::${p.app ?? 'NULL'}`, // use 'NULL' string for comparison
		);

		// Insert missing permissions
		for (const permission of permissions) {
			const permissionExists = await this.permissionRepository.findOne({
				where: {
					name: permission.name,
					app: permission.app === null ? IsNull() : permission.app,
				},
			});

			if (!permissionExists) {
				await this.permissionRepository.save(permission);
			}
		}

		// Remove permissions that are not in the seed
		const allDbPermissions = await this.permissionRepository.find();

		for (const dbPermission of allDbPermissions) {
			const key = `${dbPermission.name}::${dbPermission.app ?? 'NULL'}`;
			if (!seedKeys.includes(key)) {
				await this.permissionRepository.remove(dbPermission);
			}
		}
	}
}
