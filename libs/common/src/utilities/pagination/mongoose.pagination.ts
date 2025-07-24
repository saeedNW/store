import { Model, Document, RootFilterQuery } from 'mongoose';
import { PaginationDto } from './pagination.dto';
import { PaginatedResult, PaginationLinks } from './pagination.interface';

/**
 * Utility function to paginate data using Mongoose's find or aggregate methods.
 *
 * @template T - The type of the documents being paginated.
 * @param {PaginationDto} paginationDto - DTO containing pagination parameters (page, limit, and skip).
 * @param {Model<T>} model - The Mongoose model for the collection.
 * @param {any} [queryOrPipeline] - Optional query object for find or aggregation pipeline.
 * @param {string} [link] - The endpoint to which the data retrieved from.
 * @param {boolean} [isAggregate=false] - Whether to use aggregate pipeline.
 * @returns {Promise<PaginatedResult<T>>} - A promise that resolves to a paginated result object.
 */
export async function MongoosePaginate<T extends Document>(
	paginationDto: PaginationDto,
	model: Model<T>,
	queryOrPipeline?: any,
	link?: string,
	isAggregate: boolean = false,
	Projection: Record<string, number> = {},
): Promise<PaginatedResult<T>> {
	let totalItems: number;
	let items: T[];

	if (isAggregate) {
		// Handle aggregate queries
		const countPipeline = [...queryOrPipeline, { $count: 'total' }];
		const countResult = await model.aggregate(countPipeline).exec();
		totalItems = countResult.length > 0 ? countResult[0].total : 0;

		const paginationPipeline = [
			...queryOrPipeline,
			{ $skip: paginationDto.skip },
			{ $limit: paginationDto.limit },
		];

		items = await model.aggregate(paginationPipeline).exec();
	} else {
		// Handle normal find queries
		totalItems = await model.countDocuments(queryOrPipeline as RootFilterQuery<T>).exec();
		items = await model
			.find(queryOrPipeline as RootFilterQuery<T>, Projection)
			.skip(paginationDto.skip)
			.limit(paginationDto.limit)
			.exec();
	}

	// Return paginated result with metadata and links
	return {
		items,
		meta: {
			totalItems,
			itemCount: items.length,
			itemsPerPage: paginationDto.limit,
			totalPages: Math.ceil(totalItems / paginationDto.limit),
			currentPage: paginationDto.page,
			firstItem: paginationDto.skip + 1,
		},
		links: getPaginationLinks(link, paginationDto, totalItems),
	};
}

/**
 * Generate pagination navigation links.
 *
 * @param {string} link - The endpoint to which the data retrieved from.
 * @param {PaginationDto} paginationDto - DTO containing pagination parameters (page, limit, etc.).
 * @param {number} totalItems - Total number of items across all pages.
 * @returns {PaginationLinks | undefined} - An object containing navigation links.
 */
function getPaginationLinks(
	link: string | undefined,
	paginationDto: PaginationDto,
	totalItems: number,
): PaginationLinks | undefined {
	if (!link) return undefined;

	const totalPages = Math.ceil(totalItems / paginationDto.limit);

	link = link.includes('?') ? (link += '&') : (link += '?');

	return {
		first: `${link}page=1&limit=${paginationDto.limit}`,
		previous:
			paginationDto.page > 1
				? `${link}page=${paginationDto.page - 1}&limit=${paginationDto.limit}`
				: '',
		next:
			paginationDto.page < totalPages
				? `${link}page=${paginationDto.page + 1}&limit=${paginationDto.limit}`
				: '',
		last: `${link}page=${totalPages}&limit=${paginationDto.limit}`,
	};
}
