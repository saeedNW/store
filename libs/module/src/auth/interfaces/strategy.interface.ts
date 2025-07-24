import { EOtpType } from '../enum/otp-type.enum';

/**
 * Interface representing a strategy handler for authentication flows,
 * such as OTP-based login, registration, password reset, and token refresh.
 *
 * @template T - The type of data passed to each handler (e.g., DTO or payload).
 */
export interface IStrategyHandler<T = any> {
	/**
	 * Determines if the current strategy is applicable based on the provided data.
	 *
	 * @param {T} data - Input data (e.g., user credentials, phone/email).
	 * @param {boolean} checkUserExistence - Optional flag to check if the user already exists.
	 * @returns {Promise<boolean>} - A promise resolving to `true` if this strategy can handle the request.
	 */
	canHandle(data?: T, checkUserExistence?: boolean): Promise<boolean>;

	/**
	 * Sends an OTP to the user using the specified OTP type (e.g., login, registration).
	 *
	 * @param {T} data - Input data containing user contact info.
	 * @param {EOtpType} otpType - Type of OTP flow (login, registration, etc.).
	 * @returns {Promise<string>} - A promise resolving to a confirmation string or OTP reference ID.
	 */
	sendOtpHandler(data: T, otpType: EOtpType): Promise<string>;

	/**
	 * Verifies the provided OTP and issues new access and refresh tokens upon success.
	 *
	 * @param {T} data - Input data including OTP and user info.
	 * @returns {Promise<{ accessToken: string; refreshToken: string }>} - A promise resolving to access and refresh tokens.
	 */
	checkOtpHandler(data: T): Promise<{ accessToken: string; refreshToken: string }>;

	/**
	 * Logs the user in directly (bypassing OTP) using provided credentials.
	 *
	 * @param {T} data - Input data such as email/phone and password.
	 * @returns {Promise<{ accessToken: string; refreshToken: string }>} - A promise resolving to access and refresh tokens.
	 */
	loginHandler(data: T): Promise<{ accessToken: string; refreshToken: string }>;

	/**
	 * Verifies the user's identity before allowing password reset.
	 *
	 * @param {T} data - Input data to validate the user before password reset.
	 * @returns {Promise<void>} - A promise resolving when verification is successful.
	 */
	resetVerifyHandler(data: T): Promise<void>;

	/**
	 * Resets the user's password.
	 *
	 * @param {T} data - Input data including user ID and new password.
	 * @returns {Promise<void>} - A promise resolving when the password has been successfully updated.
	 */
	resetPasswordHandler(data: T): Promise<void>;

	/**
	 * Refreshes the access token using a valid refresh token.
	 *
	 * @param {T} data - Input data including the refresh token.
	 * @returns {Promise<{ accessToken: string; refreshToken: string }>} - A promise resolving to a new pair of access and refresh tokens.
	 */
	refreshTokenHandler(data: T): Promise<{ accessToken: string; refreshToken: string }>;
}
