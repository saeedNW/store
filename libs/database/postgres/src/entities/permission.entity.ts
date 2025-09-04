import { EPermissionApps } from '@common/enums';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../abstracts/base.entity';

@Entity('permissions')
export class PermissionEntity extends BaseEntity {
	@Column({ nullable: false })
	name: string;

	@Column({ nullable: true })
	description: string;

	@Column({ default: false, type: 'boolean', nullable: false })
	isPack: boolean;

	@Column({
		type: 'enum',
		enum: EPermissionApps,
		nullable: true,
	})
	app: EPermissionApps | null;
}
