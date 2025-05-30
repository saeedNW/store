import { UserEntity } from '@database/postgres/entities';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthTokenService } from './token.service';
import { IAuthModuleOptions } from './interfaces/auth-module-options.interface';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
		@Inject('AUTH_OPTIONS') private readonly authOptions: IAuthModuleOptions,
		private tokenService: AuthTokenService,
	) {}
}
