import { Injectable } from '@nestjs/common';
import { StorageStrategy } from '../interfaces/strategy.interface';
import { fileRemoval, TMulterFile, uploadFinalization } from '@common/utilities/multer';

/**
 * LocalStorageStrategy is a concrete implementation of the StorageStrategy interface.
 * This strategy handles file upload and removal using the local file system.
 *
 * In order to use this strategy you should use the multerFileUploader and express FileInterceptor
 * for the controller methods => @UseInterceptors(FileInterceptor("image", multerFileUploader()))
 */
@Injectable()
export class LocalStorageStrategy implements StorageStrategy {
	/**
	 * Uploads a file to the specified directory on the local file system.
	 *
	 * @param {TMulterFile} file - The uploaded file object provided by Multer.
	 * @param {string} directory - The relative or absolute path to the directory where the file should be saved.
	 * @returns {Promise<string>} - A Promise that resolves to the final file path or URL of the uploaded file.
	 */
	async uploadFile(file: TMulterFile, directory: string): Promise<string> {
		// Finalize and save the file using a utility function and return its location
		return await uploadFinalization(file, directory);
	}

	/**
	 * Removes a file from the local file system.
	 *
	 * @param {string} filePath - The path to the file that should be deleted.
	 */
	removeFile(filePath: string): void {
		// Delete the specified file using a utility function
		fileRemoval(filePath);
	}
}
