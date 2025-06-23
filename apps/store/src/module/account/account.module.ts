import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from '@database/postgres/entities';
import { StoreAuthModule } from '../auth/store-auth.module';
import { StoreAccountController } from './account.controller';
import { AccountModule } from '@modules/account';

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity]), StoreAuthModule, AccountModule],
	controllers: [StoreAccountController],
})
export class StoreAccountModule {}
