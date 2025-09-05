import { MongoModule } from '@database/mongo';
import { PostgresModule } from '@database/postgres';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PanelAccountModule } from './module/account/account.module';
import { AddressModule } from './module/address/address.module';
import { PanelAuthModule } from './module/auth/panel-auth.module';
import { ProfileModule } from './module/profile/profile.module';
import { PermissionModule } from './module/permission/permission.module';

@Module({
	imports: [
		//? Load ENVs
		ConfigModule.forRoot({
			envFilePath: ['.env.development', '.env'],
			isGlobal: true,
		}),

		//? Load Database Libraries
		PostgresModule,
		MongoModule,

		//? Load Modules
		PanelAuthModule,
		PanelAccountModule,
		ProfileModule,
		AddressModule,
		PermissionModule,
	],
})
export class AppModule {}
