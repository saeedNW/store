import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseTimestampedEntity } from '../abstracts/base.entity';
import { EUserApp } from '@common/enums';
import { ProfileEntity } from './profile.entity';

@Entity('users')
export class UserEntity extends BaseTimestampedEntity {
	@Column({ unique: true, nullable: false })
	phone: string;

	@Column({ nullable: true, default: false })
	verify_phone: boolean;

	@Column({ nullable: true })
	new_phone: string;

	@Column({ nullable: true })
	password: string;

	@Column({ type: 'text', array: true, default: [EUserApp.STORE] })
	allowedApps: EUserApp[];

	@OneToOne(() => ProfileEntity, (profile) => profile.user, { nullable: true })
	@JoinColumn({ name: 'profileId' })
	profile: ProfileEntity;
}
