import type { HttpException } from '../lib/Errors/HttpException';
import type { OptimizedApp } from './types';
import { BadRequestError, ForbiddenError, InternalServerError, NotFoundError, UnauthorizedError } from '../lib/Errors';

export const API_URLS = {
  healthCheck: '/api/health-check',
  // authentication
  auth: '/api/auth',
  authLogin: '/api/auth/login',
  authLogout: '/api/auth/logout',
  createTokens: '/api/auth/tokens',
  verifyToken: '/api/auth/verify-token',
  isPasswordValid: '/api/auth/is-password-valid',
  // users
  users: '/api/users',
  userById: '/api/users/:userId',
  getProfile: '/api/users/get-profile',
  getUserByEmail: '/api/users/get-by-email',
  // books
  books: '/api/books',
  bookById: '/api/books/:bookId',
  // dragons
  dragons: '/api/dragons',
  dragonById: '/api/dragons/:dragonId',
  // validation examples
  validateBodyByJson: '/api/validation/validate-body-by-json',
  validateQueryParamsByJson: '/api/validation/validate-query-params-by-json',
  validateParamsByJson: '/api/validation/validate-params-by-json',
  validateHeadersByJson: '/api/validation/validate-headers-by-json',
  validatePreAddedSchema: '/api/validation/validate-pre-added-schema',
  handleValidationErrorInsideRoute: '/api/validation/handle-validation-error-inside-route',
} satisfies Record<string, `/${string}`>;

export const StatusCodes = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
} as const;

type TypeOfStatusCodes = typeof StatusCodes;
export type StatusCodeKeys = keyof TypeOfStatusCodes;
export type StatusCodeValues = TypeOfStatusCodes[StatusCodeKeys];

export const StatusCodeToError: Partial<Record<StatusCodeValues, new (...args: any[]) => HttpException>> = {
  [StatusCodes.BAD_REQUEST]: BadRequestError,
  [StatusCodes.UNAUTHORIZED]: UnauthorizedError,
  [StatusCodes.FORBIDDEN]: ForbiddenError,
  [StatusCodes.NOT_FOUND]: NotFoundError,
  [StatusCodes.INTERNAL_ERROR]: InternalServerError,
} as const;

export const HttpMethod = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const;

export type HttpMethodValues = (typeof HttpMethod)[keyof typeof HttpMethod];

/**
 * Pre-defined object structure for V8 shape optimization.
 */
export const optimizedApp: OptimizedApp = {
  modules: {
    AuthenticationModule: null as any,
    HealthCheckModule: null as any,
    UsersModule: null as any,
    BooksModule: null as any,
    DragonsModule: null as any,
    // FileUploadModule: null as any,
  },
};

/**
 * Toggle between monolith and micro-services architecture.
 * - `false`: Monolith mode - BackendModule (BFF) attaches all public routes,
 *            domain modules only provide services.
 * - `true`:  Micro-services mode - Each module runs as a standalone service
 *            and attaches its own routes.
 */
export const IS_STANDALONE_MICRO_SERVICES = false;

/**
 * Default pagination values
 */
export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 10,
  sortOrder: 'desc' as const,
} as const;
