import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { permissionsSeed } from './seeds/permissions.seed';
import { PermissionEntity } from '../entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

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
	 * Checks if each permission already exists before inserting to avoid duplicates.
	 */
	private async seedPermissions() {
		const permissions = permissionsSeed;

		for (const permission of permissions) {
			// Check if the permission already exists in the database
			const permissionExists = await this.permissionRepository.findOne({
				where: { name: permission.name },
			});

			// If it doesn't exist, save the new permission
			if (!permissionExists) {
				await this.permissionRepository.save(permission);
			}
		}
	}
}
