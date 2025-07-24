import { Injectable } from '@nestjs/common';
import { LocalStorageStrategy } from './strategies/local.strategy';
import { LiaraStorageStrategy } from './strategies/liara.strategy';
import { StorageStrategy } from './interfaces/strategy.interface';
import { TMulterFile } from '@common/utilities/multer';

/**
 * Supported storage types
 */
export type StorageType = 'local' | 'liara';

/**
 * Service responsible for handling file storage operations
 * using different storage strategies (e.g., local, Liara).
 */
@Injectable()
export class StorageService {
	private readonly strategies: Map<StorageType, StorageStrategy>;

	constructor(
		private readonly localStrategy: LocalStorageStrategy,
		private readonly liaraStrategy: LiaraStorageStrategy,
	) {
		// Register strategies in a map for easier scalability and cleaner lookup
		this.strategies = new Map<StorageType, StorageStrategy>([
			['local', this.localStrategy],
			['liara', this.liaraStrategy],
		]);
	}

	/**
	 * Retrieves the appropriate storage strategy based on the given type.
	 * @param {StorageType} type The type of storage ('local' or 'liara')
	 * @returns {StorageStrategy} - The corresponding StorageStrategy implementation
	 * @throws Error if the storage type is unsupported
	 */
	private getStrategy(type: StorageType): StorageStrategy {
		const strategy = this.strategies.get(type);
		if (!strategy) {
			throw new Error(`Unsupported storage type: ${type}`);
		}
		return strategy;
	}

	/**
	 * Uploads a file to the specified directory using the selected storage type.
	 * @param {TMulterFile} file The file object from Multer
	 * @param {string} directory The destination directory/path for the file
	 * @param {StorageType} type The type of storage to use ('local' or 'liara')
	 * @returns {Promise<string>} - The URL or path of the uploaded file
	 */
	async uploadFile(file: TMulterFile, directory: string, type: StorageType): Promise<string> {
		const strategy = this.getStrategy(type);
		return strategy.uploadFile(file, directory);
	}

	/**
	 * Removes a file from the storage using the selected strategy.
	 * @param {string} filePath The full path or identifier of the file to remove
	 * @param {StorageType} type The type of storage to use ('local' or 'liara')
	 * @returns {Promise<void>} - The promise that resolves when the file is removed
	 */
	async removeFile(filePath: string, type: StorageType): Promise<void> {
		const strategy = this.getStrategy(type);
		await strategy.removeFile(filePath);
	}
}
