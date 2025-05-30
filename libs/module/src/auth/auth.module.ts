import { DynamicModule, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';
import { IAuthModuleOptions } from './interfaces/auth-module-options.interface';
import { AuthTokenService } from './token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@database/postgres/entities';
import { SmsModule } from '@modules/sms';

@Module({})
export class AuthModule {
	static register(options: IAuthModuleOptions): DynamicModule {
		return {
			module: AuthModule,
			imports: [
				TypeOrmModule.forFeature([UserEntity]),
				SmsModule,
				JwtModule.registerAsync({
					useFactory: () => ({
						secret: options.jwtSecret,
						signOptions: { expiresIn: options.accessTokenExpiresIn },
					}),
				}),
			],
			controllers: [AuthController],
			providers: [
				AuthService,
				AuthTokenService,
				JwtService,
				{ provide: 'AUTH_OPTIONS', useValue: options },
				{
					provide: 'REDIS_CONNECTION',
					useFactory: (): Redis => {
						return new Redis(options.redisConfig);
					},
				},
			],
			exports: [AuthService, JwtService, AuthTokenService, TypeOrmModule],
		};
	}
}
