import { getEnvVariable } from '@common/utilities/functions';
import { RedisModule } from '@database/redis';
import { Module } from '@nestjs/common';

@Module({
	imports: [
		RedisModule.register({
			host: getEnvVariable('REDIS_HOST'),
			port: parseInt(getEnvVariable('REDIS_PORT'), 10),
			password: getEnvVariable('REDIS_PASSWORD'),
			keyPrefix: 'shop:',
		}),
	],
	exports: [RedisModule],
})
export class ShopRedisModule {}
