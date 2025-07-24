import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { TMulterFile } from '@common/utilities/multer';

export class UpdateProfileAvatarDto {
	@ApiProperty({
		type: 'string',
		format: 'binary',
		description: 'Avatar image',
	})
	@Expose()
	avatar: TMulterFile;
}
