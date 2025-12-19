import { MAX_PAGINATION_LIMIT } from '../../constants';

/**
 * Sanitizes and validates pagination parameters.
 * Ensures page >= 1 and 1 <= limit <= MAX_PAGINATION_LIMIT
 */
export function sanitizePaginationParams(page: number, limit: number): { page: number; limit: number } {
  const sanitizedPage = Math.max(1, Math.floor(page));
  const sanitizedLimit = Math.min(MAX_PAGINATION_LIMIT, Math.max(1, Math.floor(limit)));

  return { page: sanitizedPage, limit: sanitizedLimit };
}
