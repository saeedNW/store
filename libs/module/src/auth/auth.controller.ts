import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { SendOtpResponses } from './responses/responses.decorator';

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
}
