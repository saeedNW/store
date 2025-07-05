/**
 * Extend the 'ProcessEnv' interface in the NodeJS namespace to create
 * globally accessible types for environment variables.
 *
 * Adding types here provides type suggestions when accessing variables
 * through 'process.env'.
 */
namespace NodeJS {
	interface ProcessEnv {
		// Application Environmental Variables
		STORE_PORT: string;
		PANEL_PORT: string;
		SHOP_PORT: string;
		CORS_ORIGIN: string;

		// Postgres Environmental Variables
		DB_PORT: string;
		DB_NAME: string;
		DB_USERNAME: string;
		DB_PASSWORD: string;
		DB_HOST: string;

		// MongoDB Environmental Variables
		MONGO_URI: string;
		MONGO_DB: string;

		// Redis Environmental Variables
		REDIS_HOST: string;
		REDIS_PORT: string;
		REDIS_PASSWORD: string;

		//  SMS IR Environmental Variables
		SMS_IR_API_KEY: string;
		SMS_IR_SEND_URL: string;

		// Email SMTP Environmental Variables
		MAILTRAP_HOST: string;
		MAILTRAP_USER: string;
		MAILTRAP_PASS: string;

		// JWT Environmental Variables
		TOKEN_SIGNING_ALGORITHM: string;
		ACCESS_TOKEN_EXPIRE_TIME: string;
		REFRESH_TOKEN_EXPIRE_TIME: string;
	}
}
