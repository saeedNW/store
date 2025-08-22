import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthDecorator } from '@common/decorators';
import { UpdateProfileDto } from './dto/profile-update.dto';

@Controller('profile')
@ApiTags('Profile')
@AuthDecorator()
export class ProfileController {
	constructor(private readonly profileService: ProfileService) {}

	/**
	 * Endpoint: GET /api/profile/:userId
	 * Retrieve user's profile
	 */
	@Get(':userId')
	@ApiOperation({ summary: 'Get user profile' })
	getProfile(@Param('userId') userId: string) {
		return this.profileService.getProfile(userId);
	}

	/**
	 * Endpoint: PUT /api/profile/update/:userId
	 * Update user's profile
	 */
	@Put('update/:userId')
	@ApiOperation({ summary: 'Update user profile' })
	updateProfile(@Body() updateProfileDto: UpdateProfileDto, @Param('userId') userId: string) {
		return this.profileService.updateProfile(updateProfileDto, userId);
	}

	/**
	 * Endpoint: DELETE /api/profile/avatar/:userId
	 * Delete user's avatar
	 */
	@Delete('avatar/:userId')
	@ApiOperation({ summary: 'Delete user avatar' })
	deleteProfileAvatar(@Param('userId') userId: string) {
		return this.profileService.deleteProfileAvatar(userId);
	}
}
