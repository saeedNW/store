import { MongoModule } from '@database/mongo';
import { PostgresModule } from '@database/postgres';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StoreAuthModule } from './module/auth/store-auth.module';
import { StoreAccountModule } from './module/account/account.module';
// import { ProfileModule } from './module/profile/profile.module';

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
		StoreAuthModule,
		StoreAccountModule,
		// ProfileModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
