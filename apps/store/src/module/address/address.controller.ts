import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { AddressService } from './address.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthDecorator } from '@common/decorators';
import { AddressCreateDto } from './dto/address-create.dto';
import { AddressUpdateDto } from './dto/address-update.dto';
import {
	GetAddressesResponses,
	GetAddressResponses,
	CreateAddressResponses,
	UpdateAddressResponses,
	DeleteAddressResponses,
	SetDefaultAddressResponses,
} from './response/responses.decorator';

@Controller('address')
@ApiTags('Address')
@AuthDecorator()
export class AddressController {
	constructor(private readonly addressService: AddressService) {}

	/**
	 * Endpoint: GET /api/address
	 * Get user's addresses list
	 */
	@Get()
	@ApiOperation({ summary: "Get user's addresses list" })
	@GetAddressesResponses()
	findAll() {
		return this.addressService.findAll();
	}

	/**
	 * Endpoint: GET /api/address/:id
	 * Get user's single address by id
	 */
	@Get(':id')
	@ApiOperation({ summary: "Get user's single address by id" })
	@GetAddressResponses()
	findOne(@Param('id') id: string) {
		return this.addressService.findOne(id);
	}

	/**
	 * Endpoint: POST /api/address
	 * Create address
	 */
	@Post()
	@ApiOperation({ summary: 'Create address' })
	@CreateAddressResponses()
	create(@Body() addressCreateDto: AddressCreateDto) {
		return this.addressService.create(addressCreateDto);
	}

	/**
	 * Endpoint: PUT /api/address/:id
	 * Update address
	 */
	@Put(':id')
	@ApiOperation({ summary: 'Update address' })
	@UpdateAddressResponses()
	update(@Param('id') id: string, @Body() addressUpdateDto: AddressUpdateDto) {
		return this.addressService.update(id, addressUpdateDto);
	}

	/**
	 * Endpoint: DELETE /api/address/:id
	 * Delete address
	 */
	@Delete(':id')
	@ApiOperation({ summary: 'Delete address' })
	@DeleteAddressResponses()
	delete(@Param('id') id: string) {
		return this.addressService.delete(id);
	}

	/**
	 * Endpoint: PATCH /api/address/:id
	 * Set default address
	 */
	@Patch(':id')
	@ApiOperation({ summary: 'Set default address' })
	@SetDefaultAddressResponses()
	setDefault(@Param('id') id: string) {
		return this.addressService.setDefault(id);
	}
}
