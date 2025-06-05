import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SendOtpDto } from './dto/send-otp.dto';
import {
	CheckOtpResponses,
	GetActiveSessionsResponses,
	RefreshTokenResponses,
	SendOtpResponses,
} from './responses/responses.decorator';
import { CheckOtpDto } from './dto/check-otp.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthDecorator, Token } from '@common/decorators';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	/**
	 * Endpoint: POST /auth/send-otp
	 * Sends an OTP (One-Time Password) to the user
	 */
	@Post('send-otp')
	@ApiOperation({ summary: 'Send OTP to the user' })
	@SendOtpResponses()
	sendOtp(@Body() dto: SendOtpDto) {
		return this.authService.sendOtp(dto);
	}

	/**
	 * Endpoint: POST /auth/check-otp
	 * Verifies the OTP (One-Time Password) provided by the user
	 */
	@Post('check-otp')
	@ApiOperation({ summary: 'Verify OTP from user' })
	@CheckOtpResponses()
	checkOtp(@Body() dto: CheckOtpDto) {
		return this.authService.checkOtp(dto);
	}

	/**
	 * Endpoint: POST /auth/refresh-token
	 * Refreshes the user's token
	 */
	@Post('refresh-token')
	@ApiOperation({ summary: 'Refresh token' })
	@RefreshTokenResponses()
	refreshToken(@Body() dto: RefreshTokenDto) {
		return this.authService.refreshToken(dto);
	}

	@Get('sessions')
	@ApiOperation({
		summary: 'Get user sessions',
		description: 'Each session will be revoked after 7 days from its creation automatically.',
	})
	@AuthDecorator()
	@GetActiveSessionsResponses()
	getUserSessions() {
		return this.authService.getUserSessions();
	}

	@Post('logout')
	@ApiOperation({ summary: 'Logout user and revoke current session' })
	@AuthDecorator()
	logout(@Token() token: string) {
		return this.authService.logout(token);
	}
}
