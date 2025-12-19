import type { PaginationParams } from '../../types';
import { DEFAULT_PAGINATION } from '../../constants';
import { calculateOffset } from './calculateOffset';
import { sanitizePaginationParams } from './sanitizePaginationParams';

export type ParsedPagination = {
  page: number;
  limit: number;
  offset: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
};

/**
 * Parses and sanitizes raw pagination parameters into safe, validated values.
 * Applies defaults, enforces limits, and validates sort fields against a whitelist.
 */
export function parsePaginationParams(
  pagination: PaginationParams | undefined,
  options: {
    allowedSortFields: Set<string>;
    defaultSortField: string;
  },
): ParsedPagination {
  const {
    page: rawPage = DEFAULT_PAGINATION.page,
    limit: rawLimit = DEFAULT_PAGINATION.limit,
    sortOrder = DEFAULT_PAGINATION.sortOrder,
    sortBy: rawSortBy = options.defaultSortField,
  } = pagination || {};

  const { page, limit } = sanitizePaginationParams(rawPage, rawLimit);
  const sortBy = options.allowedSortFields.has(rawSortBy) ? rawSortBy : options.defaultSortField;

  return {
    page,
    limit,
    offset: calculateOffset(page, limit),
    sortBy,
    sortOrder,
  };
}
