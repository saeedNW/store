export interface IStrategyHandler<T = any> {
	canHandle(data: T): Promise<boolean>;
	sendOtpHandler(data: T): Promise<string>;
	checkOtpHandler(data: T): Promise<{ accessToken: string; refreshToken: string }>;
}
