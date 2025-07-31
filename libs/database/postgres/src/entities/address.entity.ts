import { Column, Entity, JoinColumn, ManyToOne, Point } from 'typeorm';
import { BaseTimestampedEntity } from '../abstracts/base.entity';
import { UserEntity } from './user.entity';

@Entity('address')
export class AddressEntity extends BaseTimestampedEntity {
	@Column({ nullable: false })
	title: string;

	@Column({ nullable: false })
	province: string;

	@Column({ nullable: false })
	city: string;

	@Column({ nullable: false })
	address: string;

	@Column({ nullable: false })
	postal_code: string;

	@Column({ nullable: false, default: false })
	is_default: boolean;

	@Column({
		type: 'geography',
		spatialFeatureType: 'Point',
		srid: 4326,
	})
	location: Point;

	@ManyToOne(() => UserEntity, (user) => user.addresses, { nullable: false })
	@JoinColumn({ name: 'userId' })
	user: UserEntity;
}
