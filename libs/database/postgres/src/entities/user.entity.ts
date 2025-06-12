import { Entity, Column } from 'typeorm';
import { BaseTimestampedEntity } from '../abstracts/base.entity';
import { EUserApp } from '@common/enums';

@Entity('users')
export class UserEntity extends BaseTimestampedEntity {
	@Column({ unique: true, nullable: false })
	phone: string;

	@Column({ nullable: true, default: false })
	verify_phone: boolean;

	@Column({ nullable: true })
	password: string;

	@Column({ type: 'text', array: true, default: [EUserApp.STORE] })
	allowedApps: EUserApp[];
}
