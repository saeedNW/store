import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostgresModule } from '@database/postgres';
import { MongoModule } from '@database/mongo';
import { ShopAuthModule } from './module/auth/shop-auth.module';
import { ShopAccountModule } from './module/account/account.module';

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
		ShopAuthModule,
		ShopAccountModule,
	],
})
export class AppModule {}
