import { MongoModule } from '@database/mongo';
import { PostgresModule } from '@database/postgres';
import { LoggerModule } from '@modules/logger';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ShopAccountModule } from './module/account/account.module';
import { ShopAuthModule } from './module/auth/shop-auth.module';

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
		ShopAuthModule,
		ShopAccountModule,
	],
})
export class AppModule {}
