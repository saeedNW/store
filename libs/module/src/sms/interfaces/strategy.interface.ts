export interface SmsStrategy {
	sendOtp(phone: string, code: string): Promise<void>;
}
