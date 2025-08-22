import { ProfileEntity } from '@database/postgres/entities';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateProfileDto } from './dto/profile-update.dto';
import { plainToClass } from 'class-transformer';
import { escapeAndTrim, objectSanitizer } from '@common/utilities/sanitizer';
import { StorageService } from '@modules/storage';

@Injectable()
export class ProfileService {
	constructor(
		@InjectRepository(ProfileEntity)
		private readonly profileRepository: Repository<ProfileEntity>,
		private readonly storageService: StorageService,
	) {}

	/**
	 * Retrieve the profile associated with the specified user ID..
	 *
	 * @param {string} userId - The ID of the user whose profile is to be retrieved.
	 * @returns {Promise<{ profile: ProfileEntity }>} - The profile entity associated with the user.
	 * @throws {NotFoundException} - If the user's profile is not found.
	 */
	async getProfile(userId: string): Promise<{ profile: ProfileEntity }> {
		// Query the profile repository for a profile linked to the specified user ID
		const profile = await this.profileRepository.findOneBy({ user: { id: userId } });

		// If no profile is found, throw an error
		if (!profile) {
			throw new NotFoundException('Profile not found');
		}

		// Return the retrieved profile.
		return { profile };
	}

	/**
	 * Updates the profile associated with the specified user ID.
	 *
	 * @param {UpdateProfileDto} updateProfileDto - The data to update the user's profile with.
	 * @param {string} userId - The ID of the user whose profile is to be updated
	 * @returns {Promise<{ message: string; profile: ProfileEntity }>}
	 *	 An object containing a success message and the updated profile.
	 * @throws {NotFoundException} - If the user's profile is not found.
	 */
	async updateProfile(
		updateProfileDto: UpdateProfileDto,
		userId: string,
	): Promise<{ message: string; profile: ProfileEntity }> {
		// Transform plain object into class instance, removing any unexpected properties
		updateProfileDto = plainToClass(UpdateProfileDto, updateProfileDto, {
			excludeExtraneousValues: true,
		});

		// Sanitize the object to remove potentially harmful content
		objectSanitizer(updateProfileDto);

		// Escape and trim all fields except for 'birthday'
		escapeAndTrim(updateProfileDto, [], ['birthday']);

		// Retrieve the user's profile
		const { profile } = await this.getProfile(userId);

		// Convert the 'birthday' string to a Date object
		if (updateProfileDto.birthday) {
			updateProfileDto.birthday = new Date(updateProfileDto.birthday);
		}

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
	 * Remove the profile avatar associated with the specified user ID.
	 *
	 * @param {string} userId - The ID of the user whose avatar is to be removed.
	 * @returns {Promise<{ message: string }>} - An object containing a success message.
	 * @throws {NotFoundException} - If the user's profile is not found.
	 */
	async deleteProfileAvatar(userId: string): Promise<{ message: string }> {
		// Retrieve the user's profile
		const { profile } = await this.getProfile(userId);

		// If profile doesn't have an avatar, throw an error
		if (!profile.avatar) throw new BadRequestException("profile doesn't have an avatar");

		// Remove the profile's avatar file from storage
		this.storageService.removeFile(profile.avatar, 'liara').catch(() => {});

		// Remove the avatar data from the profile data
		this.profileRepository.update(profile.id, { avatar: () => 'NULL' }).catch(() => {});

		return { message: 'Avatar deleted successfully' };
	}
}
