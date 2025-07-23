import { Body, Controller, Get, Post, Put, HttpCode, HttpStatus } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthDecorator } from '@common/decorators';
import { GetProfileResponses, UpdateProfileResponses } from './response/responses.decorator';
import { UpdateProfileDto } from './dto/profile-update.dto';
import { RequestEmailChangeDto, VerifyEmailChangeDto } from './dto/email-update.dto';
import {
	RequestEmailChangeResponses,
	VerifyEmailChangeResponses,
} from './response/responses.decorator';

@Controller('profile')
@ApiTags('Profile')
@AuthDecorator()
export class ProfileController {
	constructor(private readonly profileService: ProfileService) {}

	/**
	 * Endpoint: GET /api/profile
	 * Retrieve user's profile
	 */
	@Get()
	@ApiOperation({ summary: 'Get user profile' })
	@GetProfileResponses()
	getProfile() {
		return this.profileService.getProfile();
	}

	/**
	 * Endpoint: PUT /api/profile/update
	 * Update user's profile
	 */
	@Put('update')
	@ApiOperation({ summary: 'Update user profile' })
	@UpdateProfileResponses()
	updateProfile(@Body() updateProfileDto: UpdateProfileDto) {
		return this.profileService.updateProfile(updateProfileDto);
	}

	/**
	 * Endpoint: POST /api/profile/email-request
	 * Request to change email address (sends verification code)
	 */
	@Post('email-request')
	@HttpCode(HttpStatus.OK) // Set the status code to 200
	@ApiOperation({ summary: 'Request email change (send verification code)' })
	@RequestEmailChangeResponses()
	requestEmailChange(@Body() requestEmailChangeDto: RequestEmailChangeDto) {
		return this.profileService.requestEmailChange(requestEmailChangeDto);
	}

	/**
	 * Endpoint: POST /api/profile/email-verify
	 * Verify email change with code
	 */
	@Post('email-verify')
	@HttpCode(HttpStatus.OK) // Set the status code to 200
	@ApiOperation({ summary: 'Verify email change with code' })
	@VerifyEmailChangeResponses()
	async verifyEmailChange(@Body() verifyEmailChangeDto: VerifyEmailChangeDto) {
		return this.profileService.verifyEmailChange(verifyEmailChangeDto);
	}
}
