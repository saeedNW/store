/**
 * Removes invalid or undesired properties from an object based on specified criteria.
 * @param {Record<string, any>} data - The object from which to delete properties.
 * @param {string[]} blackListFields - List of fields to be removed from the object.
 * @param {string[]} nullableFields - Fields that are allowed to be nullish or empty.
 * @returns {void} Modifies the input object directly.
 */
export function objectSanitizer(
	data: Record<string, any> = {},
	blackListFields: string[] = [],
	nullableFields: string[] = [],
): void {
	// Iterate over the object properties
	Object.keys(data).forEach((key) => {
		// Remove property if it is in the blacklist
		if (blackListFields.includes(key)) {
			delete data[key];
		}

		// Remove property if it is an empty array and not allowed to be nullable
		if (Array.isArray(data[key]) && data[key].length === 0 && !nullableFields.includes(key)) {
			delete data[key];
		}

		// Remove property if it is nullish or invalid and not allowed to be nullable
		if (isNullishPrimitive(data[key]) && !nullableFields.includes(key)) {
			delete data[key];
		}

		// If property is a nested object, check its properties
		if (isRecord(data[key])) {
			Object.keys(data[key]).forEach((prop) => {
				// Remove nested property if it is in the blacklist
				if (blackListFields.includes(prop)) {
					delete data[key][prop];
				}

				// Remove nested property if it is nullish or invalid and not allowed to be nullable
				if (isNullishPrimitive(data[key][prop]) && !nullableFields.includes(prop)) {
					delete data[key][prop];
				}
			});

			// Remove the nested object if it is empty and not allowed to be nullable
			if (Object.keys(data[key]).length === 0 && !nullableFields.includes(key)) {
				delete data[key];
			}
		}
	});
}

/**
 * Checks if a value is a nullish primitive.
 * @param value - The value to check.
 * @returns - True if the value is a nullish primitive, false otherwise.
 */
function isNullishPrimitive(value: unknown): value is string | number | null | undefined {
	return (
		value === '' ||
		value === ' ' ||
		value === '0' ||
		value === 0 ||
		value === null ||
		value === undefined
	);
}

/**
 * Checks if a value is a record.
 * @param value - The value to check.
 * @returns - True if the value is a record, false otherwise.
 */
function isRecord(value: unknown): value is Record<string, any> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}
