import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsJWT } from 'class-validator';

export class RefreshTokenDto {
	@ApiProperty({
		description: 'Refresh token',
		example: 'JWT TOKEN',
	})
	@IsJWT()
	@Expose()
	refreshToken: string;
}
