/**
 * Prefix MGT list endpoints read as a fuzzy, case-insensitive match instead
 * of an exact one.
 */
export const LIKE_PREFIX = 'like:';

/**
 * Marks `value` for fuzzy matching by prefixing LIKE_PREFIX. A blank value
 * stays blank so an empty filter is still left out of the query.
 *
 * @example
 * withIsLike('ada'); // 'like:ada'
 */
export const withIsLike = (value: string): string => (value ? `${LIKE_PREFIX}${value}` : value);
