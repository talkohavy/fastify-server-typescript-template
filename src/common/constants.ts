import type { OptimizedApp } from './types';

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

/**
 * Pre-defined object structure for V8 shape optimization.
 */
export const optimizedApp: OptimizedApp = {
  modules: {
    AuthenticationModule: null as any,
    UsersModule: null as any,
    HealthCheckModule: null as any,
    DragonsModule: null as any,
    // BooksModule: null as any,
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
