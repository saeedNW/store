import { MongoModule } from '@database/mongo';
import { PostgresModule } from '@database/postgres';
import { LoggerModule } from '@modules/logger';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PanelAccountModule } from './module/account/account.module';
import { AddressModule } from './module/address/address.module';
import { PanelAuthModule } from './module/auth/panel-auth.module';
import { PermissionModule } from './module/permission/permission.module';
import { ProfileModule } from './module/profile/profile.module';

@Module({
	imports: [
		// Logger module must be imported early to be available globally
		LoggerModule,

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
