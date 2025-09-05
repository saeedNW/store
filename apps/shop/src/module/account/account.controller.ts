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

@Controller({ path: 'account', version: '1' })
@ApiTags('Account')
@AuthDecorator()
export class ShopAccountController {
	constructor(private readonly accountService: AccountService) {}

	/**
	 * Endpoint: GET /api/v1/account
	 * Retrieve user's account info
	 */
	@Get()
	@ApiOperation({ summary: 'Get user account info' })
	@RetrieveAccountResponses()
	retrieveAccountData() {
		return this.accountService.retrieveAccountData();
	}

	/**
	 * Endpoint: POST /api/v1/account/phone-request
	 * Send an OTP to user's new phone number
	 */
	@Post('phone-request')
	@ApiOperation({ summary: "Send OTP to use's new phone number" })
	@PhoneOtpRequestResponses()
	phoneOtpRequest(@Body() sendOtpDto: SendOtpDto) {
		return this.accountService.phoneOtpRequest(sendOtpDto);
	}

	/**
	 * Endpoint: POST /api/v1/account/phone-verify
	 * Verify user's new phone number
	 */
	@Post('phone-verify')
	@ApiOperation({ summary: "Verify user's new phone number" })
	@HttpCode(HttpStatus.OK)
	@PhoneVerificationResponses()
	phoneVerification(@Body() checkOtpDto: CheckOtpDto) {
		return this.accountService.phoneVerification(checkOtpDto);
	}

	/**
	 * Endpoint: POST /api/v1/account/update-password
	 * Update user's password
	 */
	@Patch('update-password')
	@ApiOperation({ summary: "Update user's password" })
	@UpdatePasswordResponses()
	updatePassword(@Body() updatePasswordDto: UpdatePasswordDto) {
		return this.accountService.updatePassword(updatePasswordDto);
	}
}
