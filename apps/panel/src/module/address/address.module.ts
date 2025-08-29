import { AddressEntity } from '@database/postgres/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PanelAuthModule } from '../auth/panel-auth.module';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';

@Module({
	imports: [TypeOrmModule.forFeature([AddressEntity]), PanelAuthModule],
	controllers: [AddressController],
	providers: [AddressService],
})
export class AddressModule {}
