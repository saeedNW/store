import { AuthDecorator } from '@common/decorators';
import { AddressCreateDto, AddressUpdateDto } from '@common/dto';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AddressService } from './address.service';

@Controller('address')
@ApiTags('Address')
@AuthDecorator()
export class AddressController {
	constructor(private readonly addressService: AddressService) {}

	/**
	 * Endpoint: GET /api/address/user/:userId
	 * Get user's addresses list
	 */
	@Get('user/:userId')
	@ApiOperation({ summary: "Get user's addresses list" })
	findAll(@Param('userId') userId: string) {
		return this.addressService.findAll(userId);
	}

	/**
	 * Endpoint: GET /api/address/:id
	 * Get user's single address by id
	 */
	@Get(':id')
	@ApiOperation({ summary: "Get user's single address by id" })
	findOne(@Param('id') id: string) {
		return this.addressService.findOne(id);
	}

	/**
	 * Endpoint: Post /api/address/user/:userId
	 * Create new address for specified user
	 */
	@Post('user/:userId')
	@ApiOperation({ summary: 'Create new address for specified user' })
	create(@Param('userId') userId: string, @Body() addressCreateDto: AddressCreateDto) {
		return this.addressService.create(userId, addressCreateDto);
	}

	/**
	 * Endpoint: PUT /api/address/:id
	 * Update address
	 */
	@Put(':id')
	@ApiOperation({ summary: 'Update address' })
	update(@Param('id') id: string, @Body() addressUpdateDto: AddressUpdateDto) {
		return this.addressService.update(id, addressUpdateDto);
	}

	/**
	 * Endpoint: DELETE /api/address/:id
	 * Delete address
	 */
	@Delete(':id')
	@ApiOperation({ summary: 'Delete address' })
	delete(@Param('id') id: string) {
		return this.addressService.delete(id);
	}
}
