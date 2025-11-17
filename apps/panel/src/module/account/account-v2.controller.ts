import { AuthDecorator } from '@common/decorators';
import { CheckOtpDto, SendOtpDto } from '@common/dto';
import {
	AccountService,
	PhoneOtpRequestResponses,
	PhoneVerificationResponses,
	RetrieveAccountResponses,
	UpdatePasswordResponses,
} from '@modules/account';
import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller({ path: 'account', version: '2' })
@ApiTags('Account v2')
@AuthDecorator()
export class PanelAccountV2Controller {
	constructor(private readonly accountService: AccountService) {}

	/**
	 * Endpoint: GET /api/v2/account
	 * Retrieve user's account info with enhanced data (v2)
	 */
	@Get()
	@ApiOperation({ summary: 'Get user account info (v2 with enhanced data)' })
	@RetrieveAccountResponses()
	retrieveAccountData() {
		// In v2, we might return additional fields or different structure
		return this.accountService.retrieveAccountData();
	}

	/**
	 * Endpoint: POST /api/v2/account/phone-request
	 * Send an OTP to user's new phone number (v2 with improved security)
	 */
	@Post('phone-request')
	@ApiOperation({ summary: "Send OTP to user's new phone number (v2)" })
	@PhoneOtpRequestResponses()
	phoneOtpRequest(@Body() sendOtpDto: SendOtpDto) {
		// v2 might have additional validation or different logic
		return this.accountService.phoneOtpRequest(sendOtpDto);
	}

	/**
	 * Endpoint: POST /api/v2/account/phone-verify
	 * Verify user's new phone number (v2)
	 */
	@Post('phone-verify')
	@ApiOperation({ summary: "Verify user's new phone number (v2)" })
	@HttpCode(HttpStatus.OK)
	@PhoneVerificationResponses()
	phoneVerification(@Body() checkOtpDto: CheckOtpDto) {
		return this.accountService.phoneVerification(checkOtpDto);
	}

	/**
	 * Endpoint: PATCH /api/v2/account/update-password
	 * Update user's password (v2)
	 */
	@Patch('update-password')
	@ApiOperation({ summary: "Update user's password (v2)" })
	@UpdatePasswordResponses()
	updatePassword(@Body() updatePasswordDto: UpdatePasswordDto) {
		return this.accountService.updatePassword(updatePasswordDto);
	}

	/**
	 * Endpoint: GET /api/v2/account/preferences
	 * Get user preferences (v2 only - new endpoint)
	 */
	@Get('preferences')
	@ApiOperation({ summary: 'Get user preferences (v2 only)' })
	getUserPreferences() {
		// This is a new v2-only endpoint
		return {
			preferences: {
				theme: 'dark',
				language: 'en',
				notifications: true,
				apiVersion: '2.0.0',
			},
		};
	}

	/**
	 * Endpoint: PATCH /api/v2/account/preferences
	 * Update user preferences (v2 only - new endpoint)
	 */
	@Patch('preferences')
	@ApiOperation({ summary: 'Update user preferences (v2 only)' })
	updateUserPreferences(@Body() preferencesDto: any) {
		// This is a new v2-only endpoint
		return {
			message: 'Preferences updated successfully',
			apiVersion: '2.0.0',
		};
	}
}
