import { EUserApp } from '@common/enums';
import { getEnvVariable } from '@common/utilities/functions';
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

		//? Load Auth Module
		AuthModule.register({
			accessTokenExpiresIn: getEnvVariable('ACCESS_TOKEN_EXPIRE_TIME'),
			refreshTokenExpiresIn: getEnvVariable('REFRESH_TOKEN_EXPIRE_TIME'),
			accessTokenTimeToLive: Number(getEnvVariable('ACCESS_TOKEN_TIME_TO_LIVE')),
			refreshTokenTimeToLive: Number(getEnvVariable('REFRESH_TOKEN_TIME_TO_LIVE')),
			redisConfig: {
				host: getEnvVariable('REDIS_HOST'),
				port: parseInt(getEnvVariable('REDIS_PORT'), 10),
				password: getEnvVariable('REDIS_PASSWORD'),
				keyPrefix: 'shop:',
			},
			issuer: EUserApp.SHOP,
			audience: 'shop-users',
		}),
	],
	exports: [AuthModule],
})
export class ShopAuthModule {}
