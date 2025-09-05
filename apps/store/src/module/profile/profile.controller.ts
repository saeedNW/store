import { AuthDecorator } from '@common/decorators';
import { TMulterFile } from '@common/utilities/multer';
import { ImageUploader, S3SingleFile } from '@modules/storage';
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Patch,
	Post,
	Put,
	UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequestEmailChangeDto, VerifyEmailChangeDto } from './dto/email-update.dto';
import { UpdateProfileAvatarDto } from './dto/profile-avatar-update.dto';
import { UpdateProfileDto } from './dto/profile-update.dto';
import { ProfileService } from './profile.service';
import {
	DeleteProfileAvatarResponses,
	GetProfileResponses,
	RequestEmailChangeResponses,
	UpdateProfileAvatarResponses,
	UpdateProfileResponses,
	VerifyEmailChangeResponses,
} from './response/responses.decorator';

@Controller({ path: 'profile', version: '1' })
@ApiTags('Profile')
@AuthDecorator()
export class ProfileController {
	constructor(private readonly profileService: ProfileService) {}

	/**
	 * Endpoint: GET /api/v1/profile
	 * Retrieve user's profile
	 */
	@Get()
	@ApiOperation({ summary: 'Get user profile' })
	@GetProfileResponses()
	getProfile() {
		return this.profileService.getProfile();
	}

	/**
	 * Endpoint: PUT /api/v1/profile/update
	 * Update user's profile
	 */
	@Put('update')
	@ApiOperation({ summary: 'Update user profile' })
	@UpdateProfileResponses()
	updateProfile(@Body() updateProfileDto: UpdateProfileDto) {
		return this.profileService.updateProfile(updateProfileDto);
	}

	/**
	 * Endpoint: POST /api/v1/profile/email-request
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
	 * Endpoint: POST /api/v1/profile/email-verify
	 * Verify email change with code
	 */
	@Post('email-verify')
	@HttpCode(HttpStatus.OK) // Set the status code to 200
	@ApiOperation({ summary: 'Verify email change with code' })
	@VerifyEmailChangeResponses()
	verifyEmailChange(@Body() verifyEmailChangeDto: VerifyEmailChangeDto) {
		return this.profileService.verifyEmailChange(verifyEmailChangeDto);
	}

	/**
	 * Endpoint: PATCH /api/v1/profile/avatar
	 * Update user avatar
	 */
	@Patch('avatar')
	@ApiOperation({ summary: 'Update user avatar' })
	@UseInterceptors(S3SingleFile('avatar'))
	@ApiConsumes('multipart/form-data')
	@UpdateProfileAvatarResponses()
	updateProfileAvatar(
		@Body() updateProfileAvatarDto: UpdateProfileAvatarDto,
		@ImageUploader() avatar: TMulterFile,
	) {
		return this.profileService.updateProfileAvatar(avatar);
	}

	/**
	 * Endpoint: DELETE /api/v1/profile/avatar
	 * Delete user avatar
	 */
	@Delete('avatar')
	@ApiOperation({ summary: 'Delete user avatar' })
	@DeleteProfileAvatarResponses()
	deleteProfileAvatar() {
		return this.profileService.deleteProfileAvatar();
	}
}
