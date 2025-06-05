import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class RevokeSessionDto {
	@ApiProperty({
		description: 'Session ID',
		example: '9bbb41cf-9d08-4ee0-8397-f48681f163bc',
	})
	@IsUUID()
	sessionId: string;
}
