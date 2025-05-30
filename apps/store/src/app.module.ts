import { getEnvVariable } from '@common/utilities/functions';
import { MongoModule } from '@database/mongo';
import { PostgresModule } from '@database/postgres';
import { AuthModule } from '@modules/auth';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';

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
		AuthModule.register({
			jwtSecret: getEnvVariable('STORE_JWT_SECRET'),
			accessTokenExpiresIn: getEnvVariable('ACCESS_TOKEN_EXPIRE_TIME'),
			refreshTokenExpiresIn: getEnvVariable('REFRESH_TOKEN_EXPIRE_TIME'),
			redisConfig: {
				host: getEnvVariable('REDIS_HOST'),
				port: parseInt(getEnvVariable('REDIS_PORT'), 10),
				password: getEnvVariable('REDIS_PASSWORD'),
				keyPrefix: 'store:',
			},
			issuer: 'store-app',
			audience: 'store-users',
		}),
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
