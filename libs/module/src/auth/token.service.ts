import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { IAuthModuleOptions } from './interfaces/auth-module-options.interface';

@Injectable()
export class AuthTokenService {
	constructor(
		@Inject('REDIS_CONNECTION') private readonly redisService: Redis,
		@Inject('AUTH_OPTIONS') private readonly authOptions: IAuthModuleOptions,
	) {}
}
