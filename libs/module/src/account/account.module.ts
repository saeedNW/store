import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { RedisModule } from '@database/redis';
import { getEnvVariable } from '@common/utilities/functions';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@database/postgres/entities';
import { SmsModule } from '@modules/sms';

@Module({
	imports: [
		TypeOrmModule.forFeature([UserEntity]),
		RedisModule.register({
			host: getEnvVariable('REDIS_HOST'),
			port: parseInt(getEnvVariable('REDIS_PORT'), 10),
			password: getEnvVariable('REDIS_PASSWORD'),
			keyPrefix: 'account:',
		}),
		SmsModule,
	],
	providers: [AccountService],
	exports: [AccountService],
})
export class AccountModule {}
