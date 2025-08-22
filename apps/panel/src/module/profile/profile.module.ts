import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { ProfileEntity } from '@database/postgres/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PanelAuthModule } from '../auth/panel-auth.module';
import { StorageModule } from '@modules/storage';

@Module({
	imports: [TypeOrmModule.forFeature([ProfileEntity]), PanelAuthModule, StorageModule],
	controllers: [ProfileController],
	providers: [ProfileService],
})
export class ProfileModule {}
