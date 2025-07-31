import { AddressEntity } from '@database/postgres/entities';
import { BadRequestException, Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Point, Repository } from 'typeorm';
import { Request } from 'express';
import { AddressCreateDto } from './dto/address-create.dto';
import { AddressUpdateDto } from './dto/address-update.dto';
import { plainToClass } from 'class-transformer';
import { escapeAndTrim, objectSanitizer } from '@common/utilities/sanitizer';

@Injectable({ scope: Scope.REQUEST })
export class AddressService {
	constructor(
		@InjectRepository(AddressEntity)
		private readonly addressRepo: Repository<AddressEntity>,
		@Inject(REQUEST) private readonly request: Request,
	) {}

	/**
	 * Returns the authenticated user's ID from the request.
	 * @returns {string} - The authenticated user's ID
	 */
	private get userId(): string {
		return this.request.userId as string;
	}

	/**
	 * Sanitizes the given DTO by trimming, escaping, and removing unsafe values.
	 * @param {AddressCreateDto | AddressUpdateDto} dto - The DTO object to sanitize
	 * @returns {Record<string, any>} - The sanitized DTO object
	 */
	private sanitizeDto(dto: AddressCreateDto | AddressUpdateDto): Record<string, any> {
		objectSanitizer(dto);
		escapeAndTrim(dto);
		return dto;
	}

	/**
	 * Clears the `is_default` flag from all addresses belonging to the current user.
	 */
	private async clearDefaultFlag(): Promise<void> {
		await this.addressRepo.update(
			{ user: { id: this.userId }, is_default: true },
			{ is_default: false },
		);
	}

	/**
	 * Retrieves all addresses belonging to the authenticated user.
	 * @returns {Promise<{addresses: AddressEntity[]}>} -
	 * 	An object containing a list of AddressEntity objects
	 */
	async findAll(): Promise<{ addresses: AddressEntity[] }> {
		const addresses = await this.addressRepo.find({
			where: { user: { id: this.userId } },
		});

		return { addresses };
	}

	/**
	 * Retrieves a single address by its ID and verifies ownership.
	 * @param {string} id - The ID of the address to retrieve
	 * @throws {NotFoundException} if the address does not exist or does not belong to the user
	 * @returns {Promise<{address: AddressEntity}>} - An object containing the found AddressEntity
	 */
	async findOne(id: string): Promise<{ address: AddressEntity }> {
		const address = await this.addressRepo.findOneBy({
			id,
			user: { id: this.userId },
		});

		// If the address does not exist or does not belong to the user, throw an error
		if (!address) {
			throw new NotFoundException('Address not found');
		}

		return { address };
	}

	/**
	 * Creates a new address for the authenticated user.
	 * Sets it as default if specified, clearing the flag on existing defaults.
	 * @param {AddressCreateDto} dto - The address creation DTO
	 * @returns {Promise<{address: AddressEntity}>} -
	 * 	An object containing the newly created AddressEntity
	 */
	async create(dto: AddressCreateDto): Promise<{ address: AddressEntity }> {
		// Transform and sanitize input
		const addressDto = this.sanitizeDto(
			plainToClass(AddressCreateDto, dto, {
				excludeExtraneousValues: true,
			}),
		);

		// Convert coordinates to GeoJSON Point
		const location: Point = {
			type: 'Point',
			coordinates: [addressDto.longitude, addressDto.latitude],
		};

		// If this address is default, clear any existing default
		if (addressDto.is_default) {
			await this.clearDefaultFlag();
		}

		// Create and persist the address
		const address = this.addressRepo.create({
			...addressDto,
			location,
			user: { id: this.userId },
		});

		await this.addressRepo.save(address);
		return { address };
	}

	/**
	 * Updates an existing address.
	 * Handles optional updating of latitude and longitude.
	 * @param {string} id - ID of the address to update
	 * @param {AddressUpdateDto} dto - The address update DTO
	 * @throws {NotFoundException} if the address does not exist or does not belong to the user
	 * @returns {Promise<{address: AddressEntity}>} -	An object containing the updated AddressEntity
	 */
	async update(id: string, dto: AddressUpdateDto): Promise<{ address: AddressEntity }> {
		// Transform and sanitize input
		const updateDto = this.sanitizeDto(
			plainToClass(AddressUpdateDto, dto, {
				excludeExtraneousValues: true,
			}),
		);

		// Ensure the address exists and belongs to the user
		const { address } = await this.findOne(id);

		// Preserve current coordinates unless new ones are provided
		const [oldLng, oldLat] = address.location.coordinates;
		const { longitude, latitude, ...rest } = updateDto;

		const location: Point = {
			type: 'Point',
			coordinates: [longitude ?? oldLng, latitude ?? oldLat],
		};

		// Apply updates to the entity
		Object.assign(address, rest, { location });

		// Persist and return the updated address
		const updated = await this.addressRepo.save(address);
		return { address: updated };
	}

	/**
	 * Deletes an address by ID after verifying ownership.
	 * @param {string} id - The ID of the address to delete
	 * @throws {NotFoundException} if the address does not exist or does not belong to the user
	 * @returns {Promise<{message: string}>} - A success message
	 */
	async delete(id: string): Promise<{ message: string }> {
		// Ensure the address exists
		await this.findOne(id);
		await this.addressRepo.delete(id);

		return { message: 'Address deleted successfully' };
	}

	/**
	 * Sets a given address as the default for the user.
	 * Ensures only one default address exists at a time.
	 * @param {string} id - ID of the address to set as default
	 * @throws {BadRequestException} if the address is already the default
	 * @throws {NotFoundException} if the address does not exist or does not belong to the user
	 * @returns {Promise<{message: string}>} - A success message
	 */
	async setDefault(id: string): Promise<{ message: string }> {
		const { address } = await this.findOne(id);

		if (address.is_default) {
			throw new BadRequestException('Address is already the default');
		}

		await this.clearDefaultFlag();
		await this.addressRepo.update(id, { is_default: true });

		return { message: 'Address set as default successfully' };
	}
}
