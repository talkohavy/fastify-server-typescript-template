/**
 * Filters an object to only include keys that are in the allowed set.
 * Prevents injection attacks by whitelisting allowed field names.
 */
export function sanitizeFilter<T extends Record<string, any>>(filter: T, allowedFields: Set<string>): Partial<T> {
  const sanitized: Partial<T> = {};

  for (const key of Object.keys(filter)) {
    if (allowedFields.has(key)) {
      sanitized[key as keyof T] = filter[key];
    }
  }

  return sanitized;
}
