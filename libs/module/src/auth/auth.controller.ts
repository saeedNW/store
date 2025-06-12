import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SendOtpDto } from './dto/send-otp.dto';
import {
	CheckOtpResponses,
	GetActiveSessionsResponses,
	LogOutResponses,
	RefreshTokenResponses,
	ResetPassResponses,
	ResetPassVerifyResponses,
	RevokeSessionResponses,
	RevokeTokensResponses,
	SendOtpResponses,
} from './responses/responses.decorator';
import { CheckOtpDto } from './dto/check-otp.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthDecorator, Token } from '@common/decorators';
import { RevokeSessionDto } from './dto/revoke-session.dto';
import { ResetRequestOtpDto } from './dto/reset-request.dto';
import { ResetVerifyOtpDto } from './dto/reset-verify.dto.ts';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	/**
	 * Endpoint: POST /api/auth/send-otp
	 * Sends an OTP (One-Time Password) to the user for authentication.
	 */
	@Post('send-otp')
	@ApiOperation({ summary: 'Send OTP to the user' })
	@SendOtpResponses()
	sendOtp(@Body() dto: SendOtpDto) {
		return this.authService.sendOtp(dto);
	}

	/**
	 * Endpoint: POST /api/auth/check-otp
	 * Verifies the OTP (One-Time Password) provided by the user
	 */
	@Post('check-otp')
	@ApiOperation({ summary: 'Verify OTP from user' })
	@CheckOtpResponses()
	checkOtp(@Body() dto: CheckOtpDto) {
		return this.authService.checkOtp(dto);
	}

	/**
	 * Endpoint: POST /api/auth/reset-request
	 * Sends an OTP (One-Time Password) to the user for resetting the password.
	 */
	@Post('reset-request')
	@ApiOperation({ summary: 'Reset password OTP request' })
	@CheckOtpResponses()
	resetReq(@Body() dto: ResetRequestOtpDto) {
		return this.authService.resetReq(dto);
	}

	/**
	 * Endpoint: POST /api/auth/reset-verify
	 * Verifies the OTP (One-Time Password) provided by the user for resetting the password.
	 */
	@Post('reset-verify')
	@ApiOperation({ summary: 'Reset password OTP verification' })
	@ResetPassVerifyResponses()
	resetVerify(@Body() dto: ResetVerifyOtpDto) {
		return this.authService.resetVerify(dto);
	}

	/**
	 * Endpoint: POST /api/auth/reset-password
	 * Resets the user's password using the provided OTP.
	 */
	@Post('reset-password')
	@ApiOperation({ summary: 'Reset password' })
	@ResetPassResponses()
	resetPassword(@Body() dto: ResetPasswordDto) {
		return this.authService.resetPassword(dto);
	}

	/**
	 * Endpoint: POST /api/auth/refresh-token
	 * Refreshes the user's token
	 */
	@Post('refresh-token')
	@ApiOperation({ summary: 'Refresh token' })
	@RefreshTokenResponses()
	refreshToken(@Body() dto: RefreshTokenDto) {
		return this.authService.refreshToken(dto);
	}

	/**
	 * Endpoint: GET /api/auth/sessions
	 * Retrieves the user's active sessions
	 */
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

	/**
	 * Endpoint: POST /api/auth/logout
	 * Logs out the user and revokes the current session
	 */
	@Post('logout')
	@ApiOperation({ summary: 'Logout user and revoke current session' })
	@AuthDecorator()
	@LogOutResponses()
	logout(@Token() token: string) {
		return this.authService.logout(token);
	}

	/**
	 * Endpoint: POST /api/auth/revoke-tokens
	 * Revokes all tokens
	 */
	@Post('revoke-tokens')
	@ApiOperation({ summary: 'Revoke all tokens' })
	@AuthDecorator()
	@RevokeTokensResponses()
	revokeTokens(@Token() token: string) {
		return this.authService.revokeTokens(token);
	}

	/**
	 * Endpoint: POST /api/auth/revoke-session
	 * Revokes a specific session
	 */
	@Post('revoke-session')
	@ApiOperation({ summary: 'Revoke a token' })
	@AuthDecorator()
	@RevokeSessionResponses()
	revokeSession(@Body() revokeSessionDto: RevokeSessionDto) {
		return this.authService.revokeSession(revokeSessionDto);
	}
}
