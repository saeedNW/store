import { PermissionEntity } from '@database/postgres/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PanelAuthModule } from '../auth/panel-auth.module';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';

@Module({
	imports: [TypeOrmModule.forFeature([PermissionEntity]), PanelAuthModule],
	controllers: [PermissionController],
	providers: [PermissionService],
})
export class PermissionModule {}
