import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { importPKCS8, importSPKI } from 'jose';
import { EUserApp } from '@common/enums';
import { getEnvVariable } from '@common/utilities/functions';

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
	private readonly privateKey: {
		store: Promise<CryptoKey>;
		panel: Promise<CryptoKey>;
		shop: Promise<CryptoKey>;
	};

	/**
	 * Stores a mapping of app identifiers to their corresponding public CryptoKey Promises.
	 */
	private readonly publicKey: {
		store: Promise<CryptoKey>;
		panel: Promise<CryptoKey>;
		shop: Promise<CryptoKey>;
	};

	/**
	 * The algorithm used for signing and verifying JWTs.
	 */
	private readonly algorithm = getEnvVariable('JWT_KEYS_ALGORITHM');

	constructor() {
		// Read PEM-encoded private and public keys for each application (store, panel, shop)
		const storePrivatePem = readFileSync(resolve('./keys/ed25519_store_private.pem'), 'utf8');
		const storePublicPem = readFileSync(resolve('./keys/ed25519_store_public.pem'), 'utf8');

		const panelPrivatePem = readFileSync(resolve('./keys/ed25519_panel_private.pem'), 'utf8');
		const panelPublicPem = readFileSync(resolve('./keys/ed25519_panel_public.pem'), 'utf8');

		const shopPrivatePem = readFileSync(resolve('./keys/ed25519_shop_private.pem'), 'utf8');
		const shopPublicPem = readFileSync(resolve('./keys/ed25519_shop_public.pem'), 'utf8');

		// Convert PEM strings to CryptoKey objects asynchronously using JOSE
		this.privateKey = {
			panel: importPKCS8(panelPrivatePem, this.algorithm),
			store: importPKCS8(storePrivatePem, this.algorithm),
			shop: importPKCS8(shopPrivatePem, this.algorithm),
		};

		this.publicKey = {
			panel: importSPKI(panelPublicPem, this.algorithm),
			store: importSPKI(storePublicPem, this.algorithm),
			shop: importSPKI(shopPublicPem, this.algorithm),
		};
	}

	/**
	 * Returns the private CryptoKey for the given application.
	 *
	 * @param app - The application context (store, panel, or shop)
	 * @returns A promise that resolves to the corresponding private CryptoKey
	 */
	async getPrivateKey(app: EUserApp): Promise<CryptoKey> {
		return await this.privateKey[app];
	}

	/**
	 * Returns the public CryptoKey for the given application.
	 *
	 * @param app - The application context (store, panel, or shop)
	 * @returns A promise that resolves to the corresponding public CryptoKey
	 */
	async getPublicKey(app: EUserApp): Promise<CryptoKey> {
		return await this.publicKey[app];
	}
}
