import type { AuthenticationModule } from '../modules/authentication';
import type { BooksModule } from '../modules/books';
import type { DragonsModule } from '../modules/dragons';
import type { HealthCheckModule } from '../modules/health-check';
import type { UsersModule } from '../modules/users';

export interface OptimizedApp {
  modules: {
    AuthenticationModule: AuthenticationModule;
    HealthCheckModule: HealthCheckModule;
    UsersModule: UsersModule;
    BooksModule: BooksModule;
    DragonsModule: DragonsModule;
    // BooksModule: BooksModule;
    // FileUploadModule: FileUploadModule;
  };
}

// ============================================
// Generic Pagination Types
// ============================================

/**
 * Database-agnostic pagination input parameters.
 * Works with offset-based pagination (page/limit) which is universally supported
 * across PostgreSQL, MySQL, MongoDB, and other databases.
 */
export type PaginationParams = {
  /** Current page number (1-indexed) */
  page?: number;
  /** Number of items per page */
  limit?: number;
  /** Field to sort by */
  sortBy?: string;
  /** Sort direction: 'asc' or 'desc' */
  sortOrder?: 'asc' | 'desc';
};

/**
 * Pagination metadata returned with paginated results.
 */
export type PaginationMeta = {
  /** Current page number (1-indexed) */
  page: number;
  /** Number of items per page */
  limit: number;
  /** Total number of items across all pages */
  totalItems: number;
  /** Total number of pages */
  totalPages: number;
  /** Whether there's a next page */
  hasNextPage: boolean;
  /** Whether there's a previous page */
  hasPreviousPage: boolean;
};

/**
 * Generic paginated result wrapper.
 * All repositories should return this type for paginated queries.
 */
export type PaginatedResult<T> = {
  data: T[];
  meta: PaginationMeta;
};
