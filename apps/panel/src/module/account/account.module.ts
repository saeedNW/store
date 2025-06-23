import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from '@database/postgres/entities';
import { PanelAuthModule } from '../auth/panel-auth.module';
import { PanelAccountController } from './account.controller';
import { AccountModule } from '@modules/account';

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity]), PanelAuthModule, AccountModule],
	controllers: [PanelAccountController],
})
export class PanelAccountModule {}
