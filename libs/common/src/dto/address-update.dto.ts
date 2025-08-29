import { PartialType } from '@nestjs/swagger';
import { AddressCreateDto } from './address-create.dto';

export class AddressUpdateDto extends PartialType(AddressCreateDto) {}
