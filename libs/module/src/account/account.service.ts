import { CheckOtpDto, SendOtpDto } from '@common/dto';
import { UserEntity } from '@database/postgres/entities';
import { RedisService } from '@database/redis';
import { TOtpObject } from '@modules/auth/types/otp.type';
import { SmsService } from '@modules/sms';
import { BadRequestException, ConflictException, Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdatePasswordDto } from 'apps/store/src/module/account/dto/update-password.dto';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';
import { plainToClass } from 'class-transformer';
import { randomInt } from 'crypto';
import { Request } from 'express';
import { Not, Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class AccountService {
	constructor(
		@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
		@Inject(REQUEST) private readonly request: Request,
		private readonly redisService: RedisService,
		private readonly smsService: SmsService,
	) {}

	/**
	 * Retrieves the currently authenticated user's data, excluding sensitive fields.
	 *
	 * @returns {Promise<Partial<UserEntity> | null>} A partial user object without sensitive information
	 * like password and allowed applications, or `null` if the user is not found.
	 */
	async retrieveAccountData(): Promise<{ account: Partial<UserEntity> } | null> {
		const userId = this.request.userId;

		// Attempt to find the user by ID in the repository
		const user = await this.userRepository.findOne({ where: { id: userId } });

		// Return null if the user doesn't exist
		if (!user) return null;

		// Create a shallow copy of the user to safely remove sensitive fields
		const safeUser = { ...user } as Partial<UserEntity>;

		// Remove sensitive properties before returning the user object
		delete safeUser.password;
		delete safeUser.allowedApps;
		delete safeUser.new_phone;

		return { account: safeUser };
	}

	/**
	 * Handles OTP (One-Time Password) request for phone number verification.
	 * Ensures that the provided phone number is not already in use by another user.
	 *
	 * @param sendOtpDto - The DTO containing the phone number to send OTP to.
	 * @returns The generated OTP code as a string.
	 * @throws ConflictException if the phone number is already associated with another user.
	 * @throws BadRequestException if an OTP was recently generated and is still within the cooldown period.
	 */
	async phoneOtpRequest(sendOtpDto: SendOtpDto) {
		// Transform the incoming DTO to include only allowed properties
		sendOtpDto = plainToClass(SendOtpDto, sendOtpDto, {
			excludeExtraneousValues: true,
		});

		const userId = this.request.userId as string;

		// Check if the phone number is already associated with another user
		const duplicate = await this.userRepository.findOne({
			where: {
				phone: sendOtpDto.phone,
				id: Not(userId),
			},
		});

		if (duplicate) {
			throw new ConflictException('Phone number already exists');
		}

		// Generate and store OTP for phone number update
		const otp = await this.generateAndStoreOtp(userId);

		// Send OTP via SMS
		await this.smsService.sendOtp(sendOtpDto.phone, otp);

		// Save the requested phone umber as user's new unverified phone number
		await this.userRepository.update({ id: userId }, { new_phone: sendOtpDto.phone });

		// Return message (and OTP in non-production for debugging/testing)
		return {
			message: 'OTP sent successfully',
			otp: process.env.NODE_ENV !== 'production' ? otp : undefined,
		};
	}

	/**
	 * Verifies the OTP sent to a user's new phone number.
	 * Ensures the OTP is valid and matches the user's pending phone update.
	 *
	 * @param checkOtpDto - The DTO containing the phone number and OTP code.
	 * @returns A success message if OTP is verified successfully.
	 * @throws BadRequestException if the phone number is invalid or OTP verification fails.
	 */
	async phoneVerification(checkOtpDto: CheckOtpDto) {
		// Sanitize and transform the DTO to ensure only valid properties are processed
		checkOtpDto = plainToClass(CheckOtpDto, checkOtpDto, {
			excludeExtraneousValues: true,
		});

		const userId = this.request.userId as string;

		// Retrieve the user by ID
		const user = await this.userRepository.findOne({ where: { id: userId } });

		// Validate that user exists and the phone number matches the pending new phone
		if (!user || user.new_phone !== checkOtpDto.phone) {
			throw new BadRequestException('Invalid phone number');
		}

		// Verify the OTP against the stored value
		await this.verifyOtp(userId, checkOtpDto.otp);

		// Update the user's phone number and clear the pending new phone
		await this.userRepository.update(userId, {
			phone: checkOtpDto.phone,
			new_phone: () => 'NULL',
		});

		return 'Phone number updated successfully';
	}

	/**
	 * Updates the password for the currently authenticated user.
	 *
	 * @param updatePasswordDto - Object containing current and new passwords.
	 * @throws {BadRequestException} If the current password is incorrect or the user is not found.
	 * @returns A confirmation message upon successful password update.
	 */
	async updatePassword(updatePasswordDto: UpdatePasswordDto): Promise<string> {
		// Sanitize and transform the incoming DTO to ensure only expected fields are used
		updatePasswordDto = plainToClass(UpdatePasswordDto, updatePasswordDto, {
			excludeExtraneousValues: true,
		});

		const userId = this.request.userId as string;

		// Fetch the user from the database
		const user = await this.userRepository.findOne({ where: { id: userId } });

		if (!user) {
			throw new BadRequestException('User not found.');
		}

		// Validate the current password
		const isCurrentPasswordValid = compareSync(updatePasswordDto.currentPassword, user.password);
		if (!isCurrentPasswordValid) {
			throw new BadRequestException('The current password is incorrect.');
		}

		// Hash the new password and update it in the database
		const hashedNewPassword = hashSync(updatePasswordDto.newPassword, genSaltSync(10));
		await this.userRepository.update({ id: userId }, { password: hashedNewPassword });

		return 'Password updated successfully';
	}

	/**
	 * Constructs the Redis key used for storing OTP data for a specific user.
	 *
	 * @param userId - The ID of the user requesting the OTP.
	 * @returns A namespaced Redis key string.
	 */
	private getOtpKey(userId: string): string {
		return `otp:update_phone:${userId}`;
	}

	/**
	 * Generates a new OTP, checks for cooldown period, and stores it in Redis.
	 * Prevents multiple OTPs from being sent within a short time window.
	 *
	 * @param userId - The ID of the user requesting the OTP.
	 * @returns The newly generated OTP code.
	 * @throws BadRequestException if the user must wait before requesting a new OTP.
	 */
	private async generateAndStoreOtp(userId: string) {
		// Create a new 5-digit OTP object
		const otp: TOtpObject = {
			code: randomInt(10000, 99999).toString(),
			created_at: Date.now(),
			userId,
		};

		const otpKey = this.getOtpKey(userId);

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
	 * @param userId - The ID of the user attempting to verify the OTP.
	 * @param code - The OTP code entered by the user.
	 * @returns `true` if the OTP is valid and verification is successful.
	 * @throws BadRequestException if the OTP is missing or does not match the stored value.
	 */
	private async verifyOtp(userId: string, code: string) {
		// Construct the Redis key used to store the OTP
		const otpKey = this.getOtpKey(userId);

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
