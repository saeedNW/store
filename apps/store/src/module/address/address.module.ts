import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressEntity } from '@database/postgres/entities';
import { StoreAuthModule } from '../auth/store-auth.module';

@Module({
	imports: [TypeOrmModule.forFeature([AddressEntity]), StoreAuthModule],
	controllers: [AddressController],
	providers: [AddressService],
})
export class AddressModule {}
