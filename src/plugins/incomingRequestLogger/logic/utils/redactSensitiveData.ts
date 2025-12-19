import { REDACTED } from '../constants';

export function redactSensitiveData<T>(data: T, sensitiveKeys: Set<string>): T {
  if (!data || typeof data !== 'object') {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => redactSensitiveData(item, sensitiveKeys)) as T;
  }

  const redacted: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    if (sensitiveKeys.has(key.toLowerCase())) {
      redacted[key] = REDACTED;
    } else if (typeof value === 'object' && value !== null) {
      redacted[key] = redactSensitiveData(value, sensitiveKeys);
    } else {
      redacted[key] = value;
    }
  }

  return redacted as T;
}
