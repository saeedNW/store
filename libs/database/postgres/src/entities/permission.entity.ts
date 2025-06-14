import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../abstracts/base.entity';
import { EPermissionApps } from '@common/enums';

@Entity('permissions')
export class PermissionEntity extends BaseEntity {
	@Column({ unique: true, nullable: false })
	name: string;

	@Column({ nullable: true })
	description: string;

	@Column({ nullable: true })
	app: EPermissionApps;
}
