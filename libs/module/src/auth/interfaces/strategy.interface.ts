import { EOtpType } from '../enum/otp-type.enum';

export interface IStrategyHandler<T = any> {
	canHandle(data?: T, checkUserExistence?: boolean): Promise<boolean>;
	sendOtpHandler(data: T, otpType: EOtpType): Promise<string>;
	checkOtpHandler(data: T): Promise<{ accessToken: string; refreshToken: string }>;
	resetVerifyHandler(data: T): Promise<void>;
	resetPasswordHandler(data: T): Promise<void>;
	refreshTokenHandler(data: T): Promise<{ accessToken: string; refreshToken: string }>;
}
