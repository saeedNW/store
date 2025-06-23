import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthDecorator } from '@common/decorators';
import { CheckOtpDto, SendOtpDto } from '@common/dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import {
	AccountService,
	PhoneOtpRequestResponses,
	PhoneVerificationResponses,
	RetrieveAccountResponses,
	UpdatePasswordResponses,
} from '@modules/account';

@Controller('account')
@ApiTags('Account')
@AuthDecorator()
export class StoreAccountController {
	constructor(private readonly accountService: AccountService) {}

	/**
	 * Endpoint: GET /api/account
	 * Retrieve user's account info
	 */
	@Get()
	@ApiOperation({ summary: 'Get user account info' })
	@RetrieveAccountResponses()
	retrieveAccountData() {
		return this.accountService.retrieveAccountData();
	}

	/**
	 * Endpoint: POST /api/account/phone-request
	 * Send an OTP to user's new phone number
	 */
	@Post('phone-request')
	@ApiOperation({ summary: "Send OTP to use's new phone number" })
	@PhoneOtpRequestResponses()
	phoneOtpRequest(@Body() sendOtpDto: SendOtpDto) {
		return this.accountService.phoneOtpRequest(sendOtpDto);
	}

	/**
	 * Endpoint: POST /api/account/phone-verify
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
	 * Endpoint: POST /api/account/update-password
	 * Update user's password
	 */
	@Patch('update-password')
	@ApiOperation({ summary: "Update user's password" })
	@UpdatePasswordResponses()
	updatePassword(@Body() updatePasswordDto: UpdatePasswordDto) {
		return this.accountService.updatePassword(updatePasswordDto);
	}
}
