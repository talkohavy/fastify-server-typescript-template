import type { PaginationMeta } from '../../types';

/**
 * Helper to calculate pagination meta from count and params
 */
export function createPaginationMeta(totalItems: number, page: number, limit: number): PaginationMeta {
  const totalPages = Math.ceil(totalItems / limit);
  return {
    page,
    limit,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}
