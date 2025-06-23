import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from '@database/postgres/entities';
import { ShopAuthModule } from '../auth/shop-auth.module';
import { ShopAccountController } from './account.controller';
import { AccountModule } from '@modules/account';

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity]), ShopAuthModule, AccountModule],
	controllers: [ShopAccountController],
})
export class ShopAccountModule {}
