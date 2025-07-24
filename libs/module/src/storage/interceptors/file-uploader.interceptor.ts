import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { MulterField } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { memoryStorage } from 'multer';

/**
 * Utility function to create a file upload interceptor for single file uploads
 * and store the uploaded file in memory storage
 * @param {string} filedName - The name of the file field in the request
 */
export function S3SingleFile(filedName: string) {
	return class UploadUtility extends FileInterceptor(filedName, {
		storage: memoryStorage(),
	}) {};
}

/**
 * Utility function to create a file upload interceptor for multiple file uploads with specific fields
 * and store the uploaded files in memory storage
 * @param {MulterField[]} uploadFields - Array of field definitions specifying  the expected fields for file uploads
 */
export function S3MultiFile(uploadFields: MulterField[]) {
	return class UploadUtility extends FileFieldsInterceptor(uploadFields, {
		storage: memoryStorage(),
	}) {};
}
