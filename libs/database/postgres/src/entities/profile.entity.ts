import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseTimestampedEntity } from '../abstracts/base.entity';
import { UserEntity } from './user.entity';

@Entity('profiles')
export class ProfileEntity extends BaseTimestampedEntity {
	@Column({ nullable: false })
	username: string;

	@Column({ nullable: true })
	first_name: string;

	@Column({ nullable: true })
	last_name: string;

	@Column({ nullable: true })
	avatar: string;

	@Column({ nullable: true })
	birthday: Date;

	@Column({ nullable: true })
	email: string;

	@Column({ nullable: true })
	new_email: string;

	@Column({ default: false })
	email_verified: boolean;

	@OneToOne(() => UserEntity, (user) => user.profile, { nullable: false })
	@JoinColumn({ name: 'userId' })
	user: UserEntity;
}
