/**
 * Simple in-memory rate limiter
 * For production at scale, consider Redis-based solutions
 */

const requests = new Map<string, number[]>();

// Cleanup old entries periodically (every 5 minutes)
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;

  lastCleanup = now;
  const cutoff = now - windowMs;

  for (const [key, timestamps] of requests.entries()) {
    const valid = timestamps.filter((t) => t > cutoff);
    if (valid.length === 0) {
      requests.delete(key);
    } else {
      requests.set(key, valid);
    }
  }
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { success: boolean; remaining: number } {
  const now = Date.now();
  const cutoff = now - windowMs;

  cleanup(windowMs);

  const timestamps = requests.get(key) ?? [];
  const validTimestamps = timestamps.filter((t) => t > cutoff);

  if (validTimestamps.length >= limit) {
    return { success: false, remaining: 0 };
  }

  validTimestamps.push(now);
  requests.set(key, validTimestamps);

  return { success: true, remaining: limit - validTimestamps.length };
}
