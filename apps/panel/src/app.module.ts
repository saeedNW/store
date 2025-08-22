import { MongoModule } from '@database/mongo';
import { PostgresModule } from '@database/postgres';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PanelAuthModule } from './module/auth/panel-auth.module';
import { PanelAccountModule } from './module/account/account.module';
import { ProfileModule } from './module/profile/profile.module';

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
	],
})
export class AppModule {}
