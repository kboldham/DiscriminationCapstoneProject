// ─────────────────────────────────────────────────────────────
// Sliding-window in-memory rate limiter
// No external dependencies required.
// ─────────────────────────────────────────────────────────────

const WINDOW_MS  = 60_000; // 60-second rolling window
const AUTH_LIMIT = 15;     // requests per window for authenticated users
const ANON_LIMIT = 8;      // requests per window for anonymous (IP-keyed) users

// Map<rateLimitKey, timestamp[]>
const store = new Map<string, number[]>();

// Register a periodic cleanup once per process lifetime.
// The global guard survives Next.js HMR module reloads in dev mode,
// preventing duplicate setInterval registrations.
if (!(global as Record<string, unknown>).__rateLimitCleanupRegistered) {
  (global as Record<string, unknown>).__rateLimitCleanupRegistered = true;
  setInterval(() => {
    const cutoff = Date.now() - WINDOW_MS * 2;
    for (const [key, timestamps] of store.entries()) {
      if (timestamps.length === 0 || timestamps[timestamps.length - 1] < cutoff) {
        store.delete(key);
      }
    }
  }, 10 * 60 * 1000); // every 10 minutes
}

export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfter: number }; // retryAfter in whole seconds

/**
 * Check and record a request against the sliding-window rate limit.
 *
 * @param key    - Unique identifier: userId for authenticated users, IP for anonymous
 * @param isAnon - Whether the caller is unauthenticated (applies the stricter limit)
 */
export function checkRateLimit(key: string, isAnon: boolean): RateLimitResult {
  const limit       = isAnon ? ANON_LIMIT : AUTH_LIMIT;
  const now         = Date.now();
  const windowStart = now - WINDOW_MS;

  // Prune timestamps that have fallen outside the current window
  const timestamps = (store.get(key) ?? []).filter(t => t > windowStart);

  if (timestamps.length >= limit) {
    // The oldest timestamp in the window tells us when the next slot opens up
    const retryAfter = Math.ceil((timestamps[0] + WINDOW_MS - now) / 1000);
    return { allowed: false, retryAfter };
  }

  // Record this request and persist
  timestamps.push(now);
  store.set(key, timestamps);
  return { allowed: true };
}
