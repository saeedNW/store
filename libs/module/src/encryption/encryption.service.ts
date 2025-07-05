import { EUserApp } from '@common/enums';
import { getEnvVariable } from '@common/utilities/functions';
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

/**
 * A service responsible for AES-256-GCM encryption and decryption of strings.
 *
 * The encryption key is loaded from the environment variable `TOKEN_ENCRYPTION_KEY`
 * and must be exactly 32 characters long (256 bits).
 */
@Injectable()
export class EncryptionService {
	private readonly algorithm = 'aes-256-gcm';

	// Object holding 256-bit encryption keys for each app, stored as Buffers
	private readonly encryptionKeys: {
		store: Buffer;
		panel: Buffer;
		shop: Buffer;
	};

	constructor() {
		this.encryptionKeys = {
			store: Buffer.from(getEnvVariable('TOKEN_ENCRYPTION_KEY_STORE'), 'base64'),
			panel: Buffer.from(getEnvVariable('TOKEN_ENCRYPTION_KEY_PANEL'), 'base64'),
			shop: Buffer.from(getEnvVariable('TOKEN_ENCRYPTION_KEY_SHOP'), 'base64'),
		};
	}

	/**
	 * Encrypts a plaintext string using AES-256-GCM.
	 *
	 * The method generates a random 12-byte IV, encrypts the text, retrieves the
	 * authentication tag, and returns a base64-encoded string containing:
	 * IV (12 bytes) + Auth Tag (16 bytes) + Encrypted data.
	 *
	 * @param text - The plaintext string to encrypt.
	 * @param app - The application context (store, panel, or shop).
	 * @returns A base64-encoded string containing the IV, auth tag, and ciphertext.
	 */
	encrypt(text: string, app: EUserApp): string {
		// Generate a random 12-byte IV (recommended for GCM mode)
		const iv = crypto.randomBytes(12);

		// Create a cipher using AES-256-GCM
		const cipher = crypto.createCipheriv(this.algorithm, this.encryptionKeys[app], iv);

		// Encrypt the input text
		const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);

		// Get the authentication tag (used for data integrity)
		const authTag = cipher.getAuthTag();

		// Combine IV, auth tag, and encrypted data into a single buffer and encode as base64
		return Buffer.concat([iv, authTag, encrypted]).toString('base64');
	}

	/**
	 * Decrypts a base64-encoded string that was encrypted using AES-256-GCM.
	 *
	 * The method expects the encoded string to contain the IV, auth tag, and ciphertext
	 * in the following order: IV (12 bytes) + Auth Tag (16 bytes) + Encrypted data.
	 *
	 * @param encrypted - The base64-encoded string to decrypt.
	 * @param app - The application context (store, panel, or shop).
	 * @returns The decrypted plaintext string.
	 */
	decrypt(encrypted: string, app: EUserApp): string {
		// Decode the base64-encoded input to a Buffer
		const data = Buffer.from(encrypted, 'base64');

		// Extract IV (first 12 bytes)
		const iv = data.slice(0, 12);

		// Extract authentication tag (next 16 bytes)
		const authTag = data.slice(12, 28);

		// Extract the encrypted data (remaining bytes)
		const encryptedText = data.slice(28);

		// Create a decipher using AES-256-GCM
		const decipher = crypto.createDecipheriv(this.algorithm, this.encryptionKeys[app], iv);

		// Set the authentication tag to verify data integrity
		decipher.setAuthTag(authTag);

		// Decrypt the data and return as UTF-8 string
		const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
		return decrypted.toString('utf8');
	}
}
