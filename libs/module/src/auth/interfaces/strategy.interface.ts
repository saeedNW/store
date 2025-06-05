export interface IStrategyHandler<T = any> {
	canHandle(data?: T, checkUserExistence?: boolean): Promise<boolean>;
	sendOtpHandler(data: T): Promise<string>;
	checkOtpHandler(data: T): Promise<{ accessToken: string; refreshToken: string }>;
	refreshTokenHandler(data: T): Promise<{ accessToken: string; refreshToken: string }>;
}
