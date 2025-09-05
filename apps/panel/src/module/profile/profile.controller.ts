import { PermissionsConst } from '@common/constants';
import { AuthDecorator, Permissions } from '@common/decorators';
import { EPermissionApps } from '@common/enums';
import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateProfileDto } from './dto/profile-update.dto';
import { ProfileService } from './profile.service';

@Controller({ path: 'profile', version: '1' })
@ApiTags(`Profile`)
@AuthDecorator()
export class ProfileController {
	constructor(private readonly profileService: ProfileService) {}

	/**
	 * Endpoint: GET /api/v1/profile/:userId
	 * Retrieve user's profile
	 */
	@Get(':userId')
	@Permissions(
		[PermissionsConst.PROFILE_MANAGEMENT, PermissionsConst.PROFILE_GET],
		EPermissionApps.PANEL,
	)
	@ApiOperation({ summary: `[RBAC: ${PermissionsConst.PROFILE_GET}] - Get user profile` })
	getProfile(@Param('userId') userId: string) {
		return this.profileService.getProfile(userId);
	}

	/**
	 * Endpoint: PUT /api/v1/profile/update/:userId
	 * Update user's profile
	 */
	@Put('update/:userId')
	@Permissions(
		[PermissionsConst.PROFILE_MANAGEMENT, PermissionsConst.PROFILE_UPDATE],
		EPermissionApps.PANEL,
	)
	@ApiOperation({ summary: `[RBAC: ${PermissionsConst.PROFILE_UPDATE}] - Update user profile` })
	updateProfile(@Body() updateProfileDto: UpdateProfileDto, @Param('userId') userId: string) {
		return this.profileService.updateProfile(updateProfileDto, userId);
	}

	/**
	 * Endpoint: DELETE /api/v1/profile/avatar/:userId
	 * Delete user's avatar
	 */
	@Delete('avatar/:userId')
	@Permissions(
		[PermissionsConst.PROFILE_MANAGEMENT, PermissionsConst.PROFILE_REMOVE_AVATAR],
		EPermissionApps.PANEL,
	)
	@ApiOperation({
		summary: `[RBAC: ${PermissionsConst.PROFILE_REMOVE_AVATAR}] - Delete user avatar`,
	})
	deleteProfileAvatar(@Param('userId') userId: string) {
		return this.profileService.deleteProfileAvatar(userId);
	}
}
