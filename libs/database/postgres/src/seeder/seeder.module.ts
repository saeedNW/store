import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionEntity } from '../entities';

@Module({
	imports: [TypeOrmModule.forFeature([PermissionEntity])],
	providers: [SeederService],
})
export class SeederModule {}
