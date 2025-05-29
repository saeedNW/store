import { Entity, Column } from 'typeorm';
import { BaseTimestampedEntity } from '../abstracts/base.entity';

@Entity('users')
export class UserEntity extends BaseTimestampedEntity {
	@Column({ unique: true, nullable: false })
	phone: string;

	@Column({ nullable: true, default: false })
	verify_phone: boolean;
}
