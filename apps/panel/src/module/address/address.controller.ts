import { PermissionsConst } from '@common/constants';
import { AuthDecorator, Permissions } from '@common/decorators';
import { AddressCreateDto, AddressUpdateDto } from '@common/dto';
import { EPermissionApps } from '@common/enums';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AddressService } from './address.service';

@Controller({ path: 'address', version: '1' })
@ApiTags('Address')
@AuthDecorator()
export class AddressController {
	constructor(private readonly addressService: AddressService) {}

	/**
	 * Endpoint: GET /api/v1/address/user/:userId
	 * Get user's addresses list
	 */
	@Get('user/:userId')
	@Permissions(
		[PermissionsConst.ADDRESS_MANAGEMENT, PermissionsConst.ADDRESS_GET_ALL],
		EPermissionApps.PANEL,
	)
	@ApiOperation({
		summary: `[RBAC: ${PermissionsConst.ADDRESS_GET_ALL}] - Get user's addresses list`,
	})
	findAll(@Param('userId') userId: string) {
		return this.addressService.findAll(userId);
	}

	/**
	 * Endpoint: GET /api/v1/address/:id
	 * Get user's single address by id
	 */
	@Get(':id')
	@Permissions(
		[PermissionsConst.ADDRESS_MANAGEMENT, PermissionsConst.ADDRESS_GET_ONE],
		EPermissionApps.PANEL,
	)
	@ApiOperation({
		summary: `[RBAC: ${PermissionsConst.ADDRESS_GET_ONE}] - Get user's single address by id`,
	})
	findOne(@Param('id') id: string) {
		return this.addressService.findOne(id);
	}

	/**
	 * Endpoint: Post /api/v1/address/user/:userId
	 * Create new address for specified user
	 */
	@Post('user/:userId')
	@Permissions(
		[PermissionsConst.ADDRESS_MANAGEMENT, PermissionsConst.ADDRESS_CREATE],
		EPermissionApps.PANEL,
	)
	@ApiOperation({
		summary: `[RBAC: ${PermissionsConst.ADDRESS_CREATE}] - Create new address for specified user`,
	})
	create(@Param('userId') userId: string, @Body() addressCreateDto: AddressCreateDto) {
		return this.addressService.create(userId, addressCreateDto);
	}

	/**
	 * Endpoint: PUT /api/v1/address/:id
	 * Update address
	 */
	@Put(':id')
	@Permissions(
		[PermissionsConst.ADDRESS_MANAGEMENT, PermissionsConst.ADDRESS_UPDATE],
		EPermissionApps.PANEL,
	)
	@ApiOperation({ summary: `[RBAC: ${PermissionsConst.ADDRESS_UPDATE}] - Update address` })
	update(@Param('id') id: string, @Body() addressUpdateDto: AddressUpdateDto) {
		return this.addressService.update(id, addressUpdateDto);
	}

	/**
	 * Endpoint: DELETE /api/v1/address/:id
	 * Delete address
	 */
	@Delete(':id')
	@Permissions(
		[PermissionsConst.ADDRESS_MANAGEMENT, PermissionsConst.ADDRESS_DELETE],
		EPermissionApps.PANEL,
	)
	@ApiOperation({ summary: `[RBAC: ${PermissionsConst.ADDRESS_DELETE}] - Delete address` })
	delete(@Param('id') id: string) {
		return this.addressService.delete(id);
	}
}
