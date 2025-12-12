export const API_URLS = {
  healthCheck: '/api/health-check',
  // users
  users: '/api/users',
  userById: '/api/users/:userId',
  getProfile: '/api/users/get-profile',
  getUserByEmail: '/api/users/get-by-email',
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
