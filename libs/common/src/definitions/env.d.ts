/**
 * Extend the 'ProcessEnv' interface in the NodeJS namespace to create
 * globally accessible types for environment variables.
 *
 * Adding types here provides type suggestions when accessing variables
 * through 'process.env'.
 */
namespace NodeJS {
	interface ProcessEnv {
		// Application Configuration
		STORE_PORT: string;
		PANEL_PORT: string;
		SUPPORT_PORT: string;
		CORS_ORIGIN: string;

		// Postgres Configuration
		DB_PORT: string;
		DB_NAME: string;
		DB_USERNAME: string;
		DB_PASSWORD: string;
		DB_HOST: string;

		// MongoDB Configuration
		MONGO_URI: string;
		MONGO_DB: string;
	}
}
