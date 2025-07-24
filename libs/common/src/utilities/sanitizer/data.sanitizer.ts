import validator from 'validator';

/**
 * Escape and trim object properties, including nested arrays and objects
 * @param {Record<string, any>} body - The object to sanitize (e.g., request body)
 * @param {string[]} items - Specific fields to process (if empty, all fields are processed)
 * @param {string[]} blackListFields - Fields to exclude from processing
 */
export function escapeAndTrim(
	body: Record<string, any>,
	items: string[] = [],
	blackListFields: string[] = [],
): void {
	// If no specific items are provided, use all keys in the request body
	if (items.length === 0) {
		items = Object.keys(body);
	}

	for (const item of items) {
		// If the item exists and is not in the blacklist
		if (body[item] !== undefined && !blackListFields.includes(item)) {
			body[item] = sanitizeValue(body[item]);
		}
	}
}

/**
 * Recursively sanitize values by escaping and trimming strings,
 * processing arrays and objects without converting them to strings
 * @param {any} value - The value to sanitize
 * @returns {any} - The sanitized value
 */
function sanitizeValue(value: any): any {
	if (typeof value === 'string') {
		return validator.trim(validator.escape(value));
	} else if (Array.isArray(value)) {
		return value.map(sanitizeValue);
	} else if (typeof value === 'object' && value !== null) {
		// If it's an object, process each property recursively
		for (const key in value) {
			if (Object.prototype.hasOwnProperty.call(value, key)) {
				value[key] = sanitizeValue(value[key]);
			}
		}
	}
	return value;
}
