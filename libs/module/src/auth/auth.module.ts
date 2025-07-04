import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Redis from 'ioredis';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthTokenService } from './token.service';
import { IAuthModuleOptions } from './interfaces/auth-module-options.interface';

import { UserEntity } from '@database/postgres/entities';
import { SmsModule } from '@modules/sms';

import { PanelAuthHandler } from './strategy/panel-auth.handler';
import { ShopAuthHandler } from './strategy/shop-auth.handler';
import { StoreAuthHandler } from './strategy/store-auth.handler';
import { Ed25519KeyService } from './keys.service';

@Module({})
export class AuthModule {
	static register(options: IAuthModuleOptions): DynamicModule {
		return {
			module: AuthModule,
			imports: [TypeOrmModule.forFeature([UserEntity]), SmsModule],
			controllers: [AuthController],
			providers: [
				// Auth core
				AuthService,
				AuthTokenService,
				Ed25519KeyService,

				// Strategy Handlers
				PanelAuthHandler,
				ShopAuthHandler,
				StoreAuthHandler,

				// Injected Config/Dependencies
				{
					provide: 'AUTH_OPTIONS',
					useValue: options,
				},
				{
					provide: 'REDIS_CONNECTION',
					useFactory: (): Redis => new Redis(options.redisConfig),
				},
				{
					provide: 'STRATEGY_HANDLERS',
					useFactory: (panel: PanelAuthHandler, shop: ShopAuthHandler, store: StoreAuthHandler) => [
						panel,
						shop,
						store,
					],
					inject: [PanelAuthHandler, ShopAuthHandler, StoreAuthHandler],
				},
			],
			exports: [AuthService, AuthTokenService, TypeOrmModule],
		};
	}
}
