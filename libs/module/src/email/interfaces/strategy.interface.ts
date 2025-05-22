export interface EmailStrategy {
	sendVerificationEmail(to: string, code: string): Promise<void>;
}
