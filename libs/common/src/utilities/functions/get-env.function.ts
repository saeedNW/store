/**
 * Retrieves and validates required environment variables
 * @param {string} key - The environment variable key
 * @returns {string} - The retrieved environment variable value
 */
export function getEnvVariable(key: string): string {
	const value = process.env[key];
	if (!value) {
		throw new Error(`Missing required environment variable: ${key}`);
	}
	return value;
}
