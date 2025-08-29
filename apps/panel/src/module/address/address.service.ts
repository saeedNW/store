import { AddressCreateDto, AddressUpdateDto } from '@common/dto';
import { escapeAndTrim, objectSanitizer } from '@common/utilities/sanitizer';
import { AddressEntity } from '@database/postgres/entities';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Point, Repository } from 'typeorm';

@Injectable()
export class AddressService {
	constructor(
		@InjectRepository(AddressEntity)
		private readonly addressRepo: Repository<AddressEntity>,
	) {}

	/**
	 * Sanitizes the given DTO by trimming, escaping, and removing unsafe values.
	 *
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
	 *
	 * @param {string} userId - The ID of the user.
	 */
	private async clearDefaultFlag(userId: string): Promise<void> {
		await this.addressRepo.update(
			{ user: { id: userId }, is_default: true },
			{ is_default: false },
		);
	}

	/**
	 * Retrieves all addresses belonging to the specified user ID.
	 *
	 * @param {string} userId - The ID of the user whose addresses are to be retrieved.
	 * @returns {Promise<{addresses: AddressEntity[]}>} -
	 * 	An object containing a list of AddressEntity objects
	 */
	async findAll(userId: string): Promise<{ addresses: AddressEntity[] }> {
		const addresses = await this.addressRepo.find({
			where: { user: { id: userId } },
		});

		return { addresses };
	}

	/**
	 * Retrieves a single address by its ID.
	 *
	 * @param {string} id - The ID of the address to retrieve
	 * @throws {NotFoundException} if the address does not exist.
	 * @returns {Promise<{address: AddressEntity}>} - An object containing the found AddressEntity
	 */
	async findOne(id: string): Promise<{ address: AddressEntity }> {
		const address = await this.addressRepo.findOneBy({ id });

		if (!address) throw new NotFoundException('Address not found');

		return { address };
	}

	/**
	 * Creates a new address for the specified user.
	 * Sets it as default if specified, clearing the flag on existing defaults.
	 *
	 * @param {string} userId - The ID of the user.
	 * @param {AddressCreateDto} dto - The address creation DTO
	 * @returns {Promise<{address: AddressEntity}>} -
	 * 	An object containing the newly created AddressEntity
	 */
	async create(userId: string, dto: AddressCreateDto): Promise<{ address: AddressEntity }> {
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
			await this.clearDefaultFlag(userId);
		}

		// Create and persist the address
		const address = this.addressRepo.create({
			...addressDto,
			location,
			user: { id: userId },
		});

		await this.addressRepo.save(address);
		return { address };
	}

	/**
	 * Updates an existing address.
	 * Handles optional updating of latitude and longitude.
	 *
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
	 * Deletes an address by ID.
	 *
	 * @param {string} id - The ID of the address to delete
	 * @throws {NotFoundException} if the address does not exist or does not belong to the user
	 * @returns {Promise<{message: string}>} - A success message
	 */
	async delete(id: string): Promise<{ message: string }> {
		await this.findOne(id);
		await this.addressRepo.softDelete(id);

		return { message: 'Address deleted successfully' };
	}
}
