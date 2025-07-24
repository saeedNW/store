import { Injectable } from '@nestjs/common';
import { StorageStrategy } from '../interfaces/strategy.interface';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getEnvVariable } from '@common/utilities/functions';
import { basename, extname } from 'path';
import { TMulterFile } from '@common/utilities/multer';

/**
 * LiaraStorageStrategy is a concrete implementation of the StorageStrategy interface.
 * This strategy handles file upload and removal using the Liara S3 storage.
 *
 * In order to use this strategy you should use the file uploader interceptors, located
 * in this module for the controller methods => @UseInterceptors(S3SingleFile("image"))
 */
@Injectable()
export class LiaraStorageStrategy implements StorageStrategy {
	private readonly s3Client: S3Client;
	private readonly bucketName: string;

	constructor() {
		const accessKeyId = getEnvVariable('LIARA_S3_ACCESS_KEY');
		const secretAccessKey = getEnvVariable('LIARA_S3_SECRET_KEY');
		this.bucketName = getEnvVariable('LIARA_S3_BUCKET_NAME');
		const endpoint = getEnvVariable('LIARA_S3_ENDPOINT');

		// Initialize the S3 client with custom endpoint and credentials
		this.s3Client = new S3Client({
			region: 'default', // Liara doesn't require specific AWS regions
			endpoint,
			credentials: { accessKeyId, secretAccessKey },
		});
	}

	/**
	 * Uploads a file to the S3 bucket under the specified directory.
	 *
	 * @param {TMulterFile} file - The file to upload (provided by Multer).
	 * @param {string} directory - Directory path within the bucket to store the file.
	 * @returns {Promise<string>} - The full path (bucket/key) of the uploaded file.
	 */
	async uploadFile(file: TMulterFile, directory: string): Promise<string> {
		const fileName = this.generateFileName(file.originalname);
		const fileKey = `${directory}/${fileName}`;

		const uploadCommand = new PutObjectCommand({
			Bucket: this.bucketName,
			Key: fileKey,
			Body: file.buffer,
		});

		await this.s3Client.send(uploadCommand);

		return `${this.bucketName}/${fileKey}`;
	}

	/**
	 * Removes a file from the S3 bucket using its full file path.
	 *
	 * @param {string} filePath - Full file path in the format `${bucketName}/${key}`.
	 * @returns {Promise<void>} - A promise that resolves when the file is removed.
	 * @throws {Error} - If the file removal fails.
	 */
	async removeFile(filePath: string): Promise<void> {
		const fileKey = this.extractFileKey(filePath);

		const deleteCommand = new DeleteObjectCommand({
			Bucket: this.bucketName,
			Key: fileKey,
		});

		await this.s3Client.send(deleteCommand);
	}

	/**
	 * Generates a unique file name by appending a timestamp and cleaning the original name.
	 *
	 * @param {string} originalName - Original file name.
	 * @returns {string} - A timestamped and sanitized file name.
	 */
	private generateFileName(originalName: string): string {
		const fileExt = extname(originalName).toLowerCase();
		const baseName = basename(originalName, fileExt)
			.replace(/\s+/g, '-')
			.replace(/[^a-zA-Z0-9-_]/g, '');

		return `${Date.now()}-${baseName}${fileExt}`;
	}

	/**
	 * Extracts the object key from a full S3 file path (removing the bucket name).
	 *
	 * @param {string} filePath - Full file path (e.g., `bucket-name/folder/file.jpg`)
	 * @returns {string} - The relative object key used by S3 (e.g., `folder/file.jpg`)
	 */
	private extractFileKey(filePath: string): string {
		return filePath.replace(`${this.bucketName}/`, '');
	}
}
