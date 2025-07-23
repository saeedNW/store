import { getEnvVariable } from '@common/utilities/functions';
import { RedisModule } from '@database/redis';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: ['.env.development', '.env'],
			isGlobal: true,
		}),

		RedisModule.register({
			host: getEnvVariable('REDIS_HOST'),
			port: parseInt(getEnvVariable('REDIS_PORT'), 10),
			password: getEnvVariable('REDIS_PASSWORD'),
			keyPrefix: 'panel:',
		}),
	],
	exports: [RedisModule],
})
export class PanelRedisModule {}
