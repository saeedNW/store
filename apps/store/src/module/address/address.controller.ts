import { AuthDecorator } from '@common/decorators';
import { AddressCreateDto, AddressUpdateDto } from '@common/dto';
import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AddressService } from './address.service';
import { AddressSwaggerExample } from './examples/swagger.examples';
import {
	CreateAddressResponses,
	DeleteAddressResponses,
	GetAddressesResponses,
	GetAddressResponses,
	SetDefaultAddressResponses,
	UpdateAddressResponses,
} from './response/responses.decorator';

@Controller({ path: 'address', version: '1' })
@ApiTags('Address')
@AuthDecorator()
export class AddressController {
	constructor(private readonly addressService: AddressService) {}

	/**
	 * Endpoint: GET /api/v1/address
	 * Get user's addresses list
	 */
	@Get()
	@ApiOperation({ summary: "Get user's addresses list" })
	@GetAddressesResponses()
	findAll() {
		return this.addressService.findAll();
	}

	/**
	 * Endpoint: GET /api/v1/address/:id
	 * Get user's single address by id
	 */
	@Get(':id')
	@ApiOperation({ summary: "Get user's single address by id" })
	@GetAddressResponses()
	findOne(@Param('id') id: string) {
		return this.addressService.findOne(id);
	}

	/**
	 * Endpoint: POST /api/v1/address
	 * Create address
	 */
	@Post()
	@ApiOperation({ summary: 'Create address' })
	@ApiBody({ examples: AddressSwaggerExample.create, schema: { type: 'object' } })
	@CreateAddressResponses()
	create(@Body() addressCreateDto: AddressCreateDto) {
		return this.addressService.create(addressCreateDto);
	}

	/**
	 * Endpoint: PUT /api/v1/address/:id
	 * Update address
	 */
	@Put(':id')
	@ApiOperation({ summary: 'Update address' })
	@UpdateAddressResponses()
	update(@Param('id') id: string, @Body() addressUpdateDto: AddressUpdateDto) {
		return this.addressService.update(id, addressUpdateDto);
	}

	/**
	 * Endpoint: DELETE /api/v1/address/:id
	 * Delete address
	 */
	@Delete(':id')
	@ApiOperation({ summary: 'Delete address' })
	@DeleteAddressResponses()
	delete(@Param('id') id: string) {
		return this.addressService.delete(id);
	}

	/**
	 * Endpoint: PATCH /api/v1/address/:id
	 * Set default address
	 */
	@Patch(':id')
	@ApiOperation({ summary: 'Set default address' })
	@SetDefaultAddressResponses()
	setDefault(@Param('id') id: string) {
		return this.addressService.setDefault(id);
	}
}
