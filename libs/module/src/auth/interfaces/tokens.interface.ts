export interface ITokenPayload {
	sub: string; // userId
	jti: string;
	app: string;
}

export interface IRefreshTokenMeta {
	hashedToken: string;
	userAgent?: string;
	ip?: string;
	createdAt: number;
}
