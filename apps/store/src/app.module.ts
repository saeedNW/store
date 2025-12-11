import { MongoModule } from '@database/mongo';
import { PostgresModule } from '@database/postgres';
import { LoggerModule } from '@modules/logger';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StoreAccountModule } from './module/account/account.module';
import { AddressModule } from './module/address/address.module';
import { StoreAuthModule } from './module/auth/store-auth.module';
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
		StoreAuthModule,
		StoreAccountModule,
		ProfileModule,
		AddressModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
