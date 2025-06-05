import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { SendOtpResponses } from './responses/responses.decorator';
import { CheckOtpDto } from './dto/check-otp.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

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
	checkOtp(@Body() dto: CheckOtpDto) {
		return this.authService.checkOtp(dto);
	}

	@Post('refresh-token')
	@ApiOperation({ summary: 'Refresh token' })
	refreshToken(@Body() dto: RefreshTokenDto) {
		return this.authService.refreshToken(dto);
	}
}
