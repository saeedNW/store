import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { importPKCS8, importSPKI } from 'jose';
import { EUserApp } from '@common/enums';
import { getEnvVariable } from '@common/utilities/functions';

type TokenType = 'access' | 'refresh';
type AppKey = `${EUserApp}_${TokenType}`;
type KeyMap = Record<AppKey, Promise<CryptoKey>>;

/**
 * Service for loading and providing Ed25519 public/private keys for different application contexts.
 *
 * This service reads PEM-encoded keys from the filesystem at startup, then provides access to them
 * as `CryptoKey` objects using the JOSE library.
 */
@Injectable()
export class Ed25519KeyService {
	/**
	 * Stores a mapping of app identifiers to their corresponding private CryptoKey Promises.
	 */
	private readonly privateKey: KeyMap = {} as KeyMap;

	/**
	 * Stores a mapping of app identifiers to their corresponding public CryptoKey Promises.
	 */
	private readonly publicKey: KeyMap = {} as KeyMap;

	/**
	 * The algorithm used for signing and verifying JWTs.
	 */
	private readonly algorithm = getEnvVariable('TOKEN_SIGNING_ALGORITHM');

	constructor() {
		for (const d of ['access', 'refresh']) {
			// Read PEM-encoded private and public keys for each application (store, panel, shop)
			const storePrivate = readFileSync(resolve(`./keys/${d}/ed25519_store_private.pem`), 'utf8');
			const storePublic = readFileSync(resolve(`./keys/${d}/ed25519_store_public.pem`), 'utf8');

			const panelPrivate = readFileSync(resolve(`./keys/${d}/ed25519_panel_private.pem`), 'utf8');
			const panelPublic = readFileSync(resolve(`./keys/${d}/ed25519_panel_public.pem`), 'utf8');

			const shopPrivate = readFileSync(resolve(`./keys/${d}/ed25519_shop_private.pem`), 'utf8');
			const shopPublic = readFileSync(resolve(`./keys/${d}/ed25519_shop_public.pem`), 'utf8');

			// Convert PEM strings to CryptoKey objects asynchronously using JOSE
			this.privateKey[`store_${d}`] = importPKCS8(storePrivate, this.algorithm);
			this.publicKey[`store_${d}`] = importSPKI(storePublic, this.algorithm);

			this.privateKey[`panel_${d}`] = importPKCS8(panelPrivate, this.algorithm);
			this.publicKey[`panel_${d}`] = importSPKI(panelPublic, this.algorithm);

			this.privateKey[`shop_${d}`] = importPKCS8(shopPrivate, this.algorithm);
			this.publicKey[`shop_${d}`] = importSPKI(shopPublic, this.algorithm);
		}
	}

	/**
	 * Returns the private CryptoKey for the given application and token type.
	 *
	 * @param app - The application context (store, panel, or shop)
	 * @param type - Token type: access or refresh
	 * @returns A promise that resolves to the corresponding private CryptoKey
	 */
	async getPrivateKey(app: EUserApp, type: 'access' | 'refresh'): Promise<CryptoKey> {
		const key = `${app}_${type}`;
		return await this.privateKey[key as AppKey];
	}

	/**
	 * Returns the public CryptoKey for the given application and token type.
	 *
	 * @param app - The application context (store, panel, or shop)
	 * @param type - Token type: access or refresh
	 * @returns A promise that resolves to the corresponding public CryptoKey
	 */
	async getPublicKey(app: EUserApp, type: 'access' | 'refresh'): Promise<CryptoKey> {
		const key = `${app}_${type}`;
		return await this.publicKey[key as AppKey];
	}
}
