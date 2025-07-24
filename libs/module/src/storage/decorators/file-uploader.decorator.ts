import {
	FileTypeValidator,
	MaxFileSizeValidator,
	ParseFilePipe,
	ParseFilePipeBuilder,
	UploadedFile,
	UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

/**
 * File upload decorator for handling **required image files**.
 *
 * - Maximum file size: 5MB
 * - Allowed file types: PNG, JPG, JPEG, WEBP
 *
 * @returns A configured `@UploadedFile()` decorator with validation.
 */
export function ImageUploader() {
	return UploadedFile(
		new ParseFilePipe({
			validators: [
				// Validates that file size does not exceed 5MB
				new MaxFileSizeValidator({
					maxSize: 5 * 1024 * 1024,
					message: 'File is too large',
				}),
				// Validates that file type is one of the allowed image formats
				new FileTypeValidator({ fileType: 'image/(png|jpg|jpeg|webp)' }),
			],
		}),
	);
}

/**
 * File upload decorator for handling **optional image files**.
 *
 * - Maximum file size: 5MB
 * - Allowed file types: PNG, JPG, JPEG, WEBP
 * - File is not required (can be omitted)
 *
 * @returns A configured `@UploadedFile()` decorator with optional file validation.
 */
export function OptionalImageUploader() {
	return UploadedFile(
		new ParseFilePipe({
			validators: [
				// Validates that file size does not exceed 5MB
				new MaxFileSizeValidator({
					maxSize: 5 * 1024 * 1024,
					message: 'File is too large',
				}),
				// Validates that file type is one of the allowed image formats
				new FileTypeValidator({
					fileType: 'image/(png|jpg|jpeg|webp)',
				}),
			],
			// File is not mandatory
			fileIsRequired: false,
		}),
	);
}

/**
 * File upload decorator for handling **various file types** including:
 * - Images: PNG, JPG, JPEG, WEBP
 * - Videos: MP4, MOV, AVI, MKV
 * - Documents: PDF, DOC, DOCX
 *
 * - Maximum file size: 15MB
 *
 * @returns A configured `@UploadedFile()` decorator with broad file validation.
 */
export function FileUploader() {
	return UploadedFile(
		new ParseFilePipe({
			validators: [
				// Validates that file size does not exceed 15MB
				new MaxFileSizeValidator({
					maxSize: 15 * 1024 * 1024,
					message: 'File is too large',
				}),
				// Validates that file type is among the allowed types
				new FileTypeValidator({
					fileType:
						'image/(png|jpg|jpeg|webp)|video/(mp4|mov|avi|mkv|x-matroska)|application/(pdf|doc|docx)',
				}),
			],
		}),
	);
}

/**
 * Decorator for uploading multiple **required image files**.
 *
 * - Maximum size per file: 5MB
 * - Allowed types: PNG, JPG, JPEG, WEBP
 * - Minimum 1 file required
 */
export function MultipleImageUploader(maxCount = 5) {
	return [
		FilesInterceptor('files', maxCount),
		UploadedFiles(
			new ParseFilePipeBuilder()
				.addValidator(
					new MaxFileSizeValidator({
						maxSize: 5 * 1024 * 1024,
						message: 'File is too large',
					}),
				)
				.addValidator(
					new FileTypeValidator({
						fileType: 'image/(png|jpg|jpeg|webp)',
					}),
				)
				.build({
					fileIsRequired: true, // Require at least one file
				}),
		),
	];
}

/**
 * Decorator for uploading multiple **optional image files**.
 *
 * - Maximum size per file: 5MB
 * - Allowed types: PNG, JPG, JPEG, WEBP
 * - No files required (can be empty)
 */
export function OptionalMultipleImageUploader(maxCount = 5) {
	return [
		FilesInterceptor('files', maxCount),
		UploadedFiles(
			new ParseFilePipeBuilder()
				.addValidator(
					new MaxFileSizeValidator({
						maxSize: 5 * 1024 * 1024,
						message: 'File is too large',
					}),
				)
				.addValidator(
					new FileTypeValidator({
						fileType: 'image/(png|jpg|jpeg|webp)',
					}),
				)
				.build({
					fileIsRequired: false, // Files are optional
				}),
		),
	];
}

/**
 * Decorator for uploading multiple files (images, videos, documents).
 *
 * - Maximum size per file: 15MB
 * - Allowed types: Images, Videos, PDFs, DOC, DOCX
 * - At least one file is required
 */
export function MultipleFileUploader(maxCount = 10) {
	return [
		FilesInterceptor('files', maxCount),
		UploadedFiles(
			new ParseFilePipeBuilder()
				.addValidator(
					new MaxFileSizeValidator({
						maxSize: 15 * 1024 * 1024,
						message: 'File is too large',
					}),
				)
				.addValidator(
					new FileTypeValidator({
						fileType:
							'image/(png|jpg|jpeg|webp)|video/(mp4|mov|avi|mkv|x-matroska)|application/(pdf|doc|docx)',
					}),
				)
				.build({
					fileIsRequired: true,
				}),
		),
	];
}
