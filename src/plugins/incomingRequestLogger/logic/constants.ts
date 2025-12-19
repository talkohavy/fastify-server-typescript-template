export const REDACTED = '****_REDACTED_****';

export const SENSITIVE_HEADERS = new Set([
  'authorization',
  'cookie',
  'set-cookie',
  'x-api-key',
  'x-auth-token',
  'proxy-authorization',
]);

export const SENSITIVE_BODY_FIELDS = new Set([
  'password',
  'newPassword',
  'oldPassword',
  'confirmPassword',
  'secret',
  'token',
  'accessToken',
  'refreshToken',
  'apiKey',
  'creditCard',
  'cardNumber',
  'cvv',
  'ssn',
]);
