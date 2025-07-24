import { TMulterFile } from '@common/utilities/multer';

/**
 * Interface representing a storage strategy for handling file operations.
 * Implementations of this interface define how files are uploaded and removed
 * in a specific storage backend (e.g., local disk, cloud storage, etc.).
 */
export interface StorageStrategy {
	/**
	 * Uploads a file to the specified directory within the storage system.
	 *
	 * @param {TMulterFile} file - The file object provided during an HTTP file upload.
	 * @param {string} directory - The target directory path (relative or absolute, depending on implementation)
	 *                    				 where the file should be stored.
	 * @returns {Promise<string>} - A Promise that resolves to a string representing the path or URL to the uploaded file.
	 */
	uploadFile(file: TMulterFile, directory: string): Promise<string>;

	/**
	 * Removes a file from the storage system.
	 *
	 * @param {string} filePath - The full path or identifier of the file to be deleted,
	 *                   					depending on the storage backend (e.g., local path or cloud file key).
	 * @returns {Promise<void>} - A Promise that resolves once the file has been successfully deleted.
	 */
	removeFile(filePath: string): Promise<void> | void;
}
