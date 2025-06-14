import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SeederModule } from './seeder/seeder.module';

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
				autoLoadEntities: true,
				synchronize: config.get<string>('NODE_ENV') !== 'production',
			}),
		}),

		SeederModule,
	],
})
export class PostgresModule {}
