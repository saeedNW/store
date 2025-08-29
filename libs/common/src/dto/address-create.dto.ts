import { fixNumbers } from '@common/utilities/sanitizer';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsBoolean, IsNumber, IsNumberString, IsString, Length, Max, Min } from 'class-validator';

export class AddressCreateDto {
	@ApiProperty({
		description: 'Address title',
		example: 'Home',
	})
	@IsString()
	@Length(3, 50)
	@Expose()
	title: string;

	@ApiProperty({
		description: 'Address province',
		example: 'Tehran',
	})
	@Length(2, 50)
	@Expose()
	province: string;

	@ApiProperty({
		description: 'Address city',
		example: 'Tehran',
	})
	@Length(2, 50)
	@Expose()
	city: string;

	@ApiProperty({
		description: 'Address details',
		example: '123 Main St',
	})
	@Length(10, 150)
	@Expose()
	address: string;

	@ApiProperty({
		description: 'Address postal code',
		example: '123456',
	})
	@Transform(({ value }: { value: string }) => (!value ? undefined : fixNumbers(value)))
	@IsNumberString()
	@Expose()
	postal_code: string;

	@ApiProperty({
		description: 'Address is default',
		example: true,
	})
	@IsBoolean()
	@Expose()
	is_default: boolean;

	@ApiProperty({
		description: 'Address latitude',
		example: 35.7152,
	})
	@Transform(({ value }: { value: number }) => (!value ? undefined : Number(fixNumbers(value))))
	@IsNumber({ maxDecimalPlaces: 6 })
	@Min(-90)
	@Max(90)
	@Expose()
	latitude: number;

	@ApiProperty({
		description: 'Address longitude',
		example: 51.4043,
	})
	@Transform(({ value }: { value: number }) => (!value ? undefined : Number(fixNumbers(value))))
	@IsNumber({ maxDecimalPlaces: 6 })
	@Min(-180)
	@Max(180)
	@Expose()
	longitude: number;
}
