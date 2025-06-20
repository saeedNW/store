import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';
import { PostgresModule } from '@database/postgres';
import { MongoModule } from '@database/mongo';
import { ShopAuthModule } from './module/auth/shop-auth.module';

@Module({
	imports: [
		//? Load ENVs
		ConfigModule.forRoot({
			envFilePath: path.resolve('.env'),
			isGlobal: true,
		}),

		//? Load Database Libraries
		PostgresModule,
		MongoModule,

		//? Load Modules
		ShopAuthModule,
	],
})
export class AppModule {}
