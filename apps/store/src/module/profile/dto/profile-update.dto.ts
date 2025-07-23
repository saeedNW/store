import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDateString, IsOptional, IsString, Length } from 'class-validator';

export class UpdateProfileDto {
	@ApiPropertyOptional({ description: 'Username', example: 'JohnDoe' })
	@IsOptional()
	@Length(3, 50)
	@IsString()
	@Expose()
	username: string;

	@ApiPropertyOptional({ description: 'First name', example: 'John' })
	@IsOptional()
	@Length(3, 50)
	@IsString()
	@Expose()
	first_name: string;

	@ApiPropertyOptional({ description: 'Last name', example: 'Doe' })
	@IsOptional()
	@Length(3, 50)
	@IsString()
	@Expose()
	last_name: string;

	@ApiPropertyOptional({ description: 'Birthday', example: '2000-01-01' })
	@IsOptional()
	@IsDateString()
	@Expose()
	birthday: Date;
}
