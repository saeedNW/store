import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileEntity } from '@database/postgres/entities';
import { StoreAuthModule } from '../auth/store-auth.module';
import { EmailModule } from '@modules/email/email.module';
import { StoreRedisModule } from '../redis/store-redis.module';
import { StorageModule } from '@modules/storage';

@Module({
	imports: [
		TypeOrmModule.forFeature([ProfileEntity]),
		StoreAuthModule,
		EmailModule,
		StoreRedisModule,
		StorageModule,
	],
	controllers: [ProfileController],
	providers: [ProfileService],
})
export class ProfileModule {}
