import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class RefreshTokenDto {
	@ApiProperty({
		description: 'Refresh token',
		example: 'JWT TOKEN',
	})
	@IsString()
	@Expose()
	refreshToken: string;
}
