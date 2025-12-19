/**
 * Helper to calculate skip/offset from page and limit.
 * Assumes page and limit are already sanitized.
 */
export function calculateOffset(page: number, limit: number): number {
  return (page - 1) * limit;
}
