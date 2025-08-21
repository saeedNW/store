import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SeederModule } from './seeder/seeder.module';
import { AddressEntity, PermissionEntity, ProfileEntity, UserEntity } from './entities';

@Module({
	imports: [
		// Make sure ConfigModule is available inside the lib
		ConfigModule,

		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (config: ConfigService) => ({
				type: 'postgres',
				host: config.get<string>('DB_HOST'),
				port: config.get<number>('DB_PORT'),
				username: config.get<string>('DB_USERNAME'),
				password: config.get<string>('DB_PASSWORD'),
				database: config.get<string>('DB_NAME'),
				synchronize: config.get<string>('NODE_ENV') !== 'production',
				entities: [AddressEntity, PermissionEntity, ProfileEntity, UserEntity],
			}),
		}),

		SeederModule,
	],
})
export class PostgresModule {}
