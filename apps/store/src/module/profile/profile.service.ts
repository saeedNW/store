import { ProfileEntity } from '@database/postgres/entities';
import {
	BadRequestException,
	ConflictException,
	Inject,
	Injectable,
	NotFoundException,
	Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Not, Repository } from 'typeorm';
import { UpdateProfileDto } from './dto/profile-update.dto';
import { RequestEmailChangeDto, VerifyEmailChangeDto } from './dto/email-update.dto';
import { escapeAndTrim, objectSanitizer } from '@common/utilities/sanitizer';
import { plainToClass } from 'class-transformer';
import { EmailService } from '@modules/email/email.service';
import { randomBytes } from 'crypto';
import { RedisService } from '@database/redis';
import { TOtpObject } from '@modules/auth/types/otp.type';
import { TMulterFile } from '@common/utilities/multer';
import { StorageService } from '@modules/storage';

@Injectable({ scope: Scope.REQUEST })
export class ProfileService {
	constructor(
		@InjectRepository(ProfileEntity)
		private readonly profileRepository: Repository<ProfileEntity>,
		@Inject(REQUEST) private request: Request,
		private readonly redisService: RedisService,
		private readonly emailService: EmailService,
		private readonly storageService: StorageService,
	) {}

	/**
	 * Creates and saves a new user profile.
	 *
	 * @param {Partial<ProfileEntity>} data - The profile data to be saved.
	 * @returns {Promise<ProfileEntity>} - The newly created and saved profile entity.
	 */
	async create(data: Partial<ProfileEntity>): Promise<ProfileEntity> {
		// Save the provided profile data to the database using the repository.
		return await this.profileRepository.save(data);
	}

	/**
	 * Retrieves the profile associated with the currently authenticated user.
	 *
	 * @returns {Promise<{profile:ProfileEntity | null}>} - The profile entity associated with the current user.
	 */
	async getProfile(): Promise<{ profile: ProfileEntity | null }> {
		// Extract the user ID from the request context.
		const userId = this.request.userId;

		// Query the profile repository for a profile linked to the specified user ID
		const profile = await this.profileRepository.findOneBy({ user: { id: userId } });

		// Return the retrieved profile.
		return { profile };
	}

	/**
	 * Updates the authenticated user's profile with the provided data.
	 *
	 * @param {UpdateProfileDto} updateProfileDto - The data to update the user's profile with.
	 * @returns {Promise<{ message: string; profile: ProfileEntity }>}
	 *	 An object containing a success message and the updated profile.
	 * @throws {NotFoundException} - If the user's profile is not found.
	 */
	async updateProfile(
		updateProfileDto: UpdateProfileDto,
	): Promise<{ message: string; profile: ProfileEntity }> {
		// Transform plain object into class instance, removing any unexpected properties
		updateProfileDto = plainToClass(UpdateProfileDto, updateProfileDto, {
			excludeExtraneousValues: true,
		});

		// Sanitize the object to remove potentially harmful content
		objectSanitizer(updateProfileDto);

		// Escape and trim all fields except for 'birthday'
		escapeAndTrim(updateProfileDto, [], ['birthday']);

		// Retrieve the current user's profile
		const { profile } = await this.getProfile();

		// Throw an error if no profile exists
		if (!profile) throw new NotFoundException('Profile not found');

		// Convert the 'birthday' string to a Date object
		updateProfileDto.birthday = new Date(updateProfileDto.birthday);

		// Merge the update data into the existing profile
		Object.assign(profile, updateProfileDto);

		// Save the updated profile to the database
		const updatedProfile = await this.profileRepository.save(profile);

		// Return a success response with the updated profile
		return {
			message: 'Profile updated successfully',
			profile: updatedProfile,
		};
	}

	/**
	 * Request to change email address (sends verification code)
	 *
	 * @param {RequestEmailChangeDto} requestEmailChangeDto - The data to request the email change with.
	 * @returns {Promise<{ message: string; otp?: string }>}
	 *	An object containing a success message and the OTP.
	 */
	async requestEmailChange(
		requestEmailChangeDto: RequestEmailChangeDto,
	): Promise<{ message: string; otp?: string }> {
		// Transform the incoming DTO to include only allowed properties
		requestEmailChangeDto = plainToClass(RequestEmailChangeDto, requestEmailChangeDto, {
			excludeExtraneousValues: true,
		});

		// Get the current user's profile
		const { profile } = await this.getProfile();
		if (!profile) throw new NotFoundException('Profile not found');

		// Check if the new email is already associated with another user
		const duplicate = await this.profileRepository.findOne({
			where: {
				email: requestEmailChangeDto.email,
				id: Not(profile.id),
			},
		});

		if (duplicate) throw new ConflictException('Email already exists');

		// Generate and store OTP for email change
		const otp = await this.generateAndStoreOtp(profile.id);

		// Send OTP via email
		this.emailService.sendVerificationEmail(requestEmailChangeDto.email, otp).catch(() => {});

		// Save the new email address to the profile
		profile.new_email = requestEmailChangeDto.email;
		await this.profileRepository.save(profile);

		return {
			message: 'Verification code sent to new email address',
			otp: process.env.NODE_ENV !== 'production' ? otp : undefined,
		};
	}

	/**
	 * Verify email change: checks code, updates email, sets verified, clears pending fields
	 *
	 * @param {VerifyEmailChangeDto} verifyEmailChangeDto - The data to verify the email change with.
	 * @returns {Promise<{ message: string }>} - An object containing a success message.
	 */
	async verifyEmailChange(
		verifyEmailChangeDto: VerifyEmailChangeDto,
	): Promise<{ message: string }> {
		// Transform the incoming DTO to include only allowed properties
		verifyEmailChangeDto = plainToClass(VerifyEmailChangeDto, verifyEmailChangeDto, {
			excludeExtraneousValues: true,
		});

		// Get the current user's profile
		const { profile } = await this.getProfile();
		if (!profile) throw new NotFoundException('Profile not found');

		// Check if there is a pending email change request
		if (!profile?.new_email) {
			throw new NotFoundException('No pending email change request');
		}

		// Verify the OTP against the stored value
		await this.verifyOtp(profile.id, verifyEmailChangeDto.code);

		// Update the profile with the new email address
		await this.profileRepository.update(profile.id, {
			email: profile.new_email,
			email_verified: true,
			new_email: () => 'NULL',
		});

		return { message: 'Email address updated and verified successfully' };
	}

	/**
	 * Update user avatar
	 *
	 * @param {TMulterFile} avatar - The avatar file to update
	 * @returns {Promise<{ message: string; avatar: string }>}
	 * 	An object containing a success message and the new avatar path
	 */
	async updateProfileAvatar(avatar: TMulterFile): Promise<{ message: string; avatar: string }> {
		// Get the current user's profile
		const { profile } = await this.getProfile();
		if (!profile) throw new NotFoundException('Profile not found');

		// Get the user ID from the request
		const userId = this.request.userId;

		// Upload the avatar file to the storage
		const avatarPath = await this.storageService.uploadFile(avatar, `avatars/${userId}`, 'liara');

		// Update the profile with the new avatar path
		this.profileRepository.update(profile.id, { avatar: avatarPath }).catch(() => {});

		// Remove the old avatar file from the storage
		this.storageService.removeFile(profile.avatar, 'liara').catch(() => {});

		return { message: 'Avatar updated successfully', avatar: avatarPath };
	}

	/**
	 * Delete user avatar
	 *
	 * @returns {Promise<{ message: string }>} - An object containing a success message
	 */
	async deleteProfileAvatar(): Promise<{ message: string }> {
		// Get the current user's profile
		const { profile } = await this.getProfile();
		if (!profile) throw new NotFoundException('Profile not found');

		// Check if the user has an avatar
		if (!profile.avatar) throw new NotFoundException('Avatar not found');

		// Remove the avatar file from the storage
		this.storageService.removeFile(profile.avatar, 'liara').catch(() => {});

		// Update the profile with the new avatar path
		this.profileRepository.update(profile.id, { avatar: () => 'NULL' }).catch(() => {});

		return { message: 'Avatar deleted successfully' };
	}

	/**
	 * Constructs the Redis key used for storing OTP data for a specific user.
	 *
	 * @param profileId - The ID of the profile requesting the OTP.
	 * @returns {string} - A namespaced Redis key string.
	 */
	private getOtpKey(profileId: string): string {
		return `otp:update_email:${profileId}`;
	}

	/**
	 * Generates a new OTP, checks for cooldown period, and stores it in Redis.
	 * Prevents multiple OTPs from being sent within a short time window.
	 *
	 * @param profileId - The ID of the profile requesting the OTP.
	 * @returns {Promise<string>} - The newly generated OTP code.
	 * @throws {BadRequestException} - If the user must wait before requesting a new OTP.
	 */
	private async generateAndStoreOtp(profileId: string): Promise<string> {
		// Create a new OTP object
		const otp: TOtpObject = {
			code: randomBytes(3).toString('hex').slice(0, 6).toUpperCase(),
			created_at: Date.now(),
			userId: profileId,
		};

		const otpKey = this.getOtpKey(profileId);

		// Check if there's an existing OTP and enforce a cooldown period
		const existingOtp: TOtpObject | null = await this.redisService.get(otpKey);

		if (existingOtp) {
			const now = Date.now();
			const waitTimeMs = existingOtp.created_at + 2 * 60 * 1000; // 2-minute cooldown

			// If a previous OTP was generated within the last 2 minutes, prevent a new one
			if (now < waitTimeMs) {
				const secondsLeft = Math.ceil((waitTimeMs - now) / 1000);
				throw new BadRequestException(
					`Please wait ${secondsLeft} seconds before requesting another OTP.`,
				);
			}
		}

		// Store the new OTP in Redis with a 2-minute expiration
		await this.redisService.set(otpKey, otp, 2 * 60);
		return otp.code;
	}

	/**
	 * Verifies the OTP code provided by the user against the stored value in Redis.
	 * Deletes the OTP after successful verification and sets a temporary 'verified' flag.
	 *
	 * @param {string} profileId - The ID of the profile attempting to verify the OTP.
	 * @param {string} code - The OTP code entered by the user.
	 * @returns {Promise<boolean>} `true` if the OTP is valid and verification is successful.
	 * @throws {BadRequestException} - If the OTP is missing or does not match the stored value.
	 */
	private async verifyOtp(profileId: string, code: string): Promise<boolean> {
		// Construct the Redis key used to store the OTP
		const otpKey = this.getOtpKey(profileId);

		// Retrieve the stored OTP object from Redis
		const storedOtp: TOtpObject | null = await this.redisService.get(otpKey);

		// Check if the OTP exists and matches the provided code
		if (!storedOtp || storedOtp.code !== code) {
			throw new BadRequestException('Invalid OTP');
		}

		// Delete the OTP after successful verification
		await this.redisService.del(otpKey);

		return true;
	}
}
