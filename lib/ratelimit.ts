// ─────────────────────────────────────────────────────────────
// Sliding-window in-memory rate limiter
// No external dependencies required.
//
// NOTE: This store lives in Node.js process memory. On serverless
// platforms (Vercel, AWS Lambda) each function instance has isolated
// memory, so limits are per-instance rather than globally enforced.
// For production hardening replace this store with a shared Redis /
// Upstash instance — the checkRateLimit signature stays the same.
// ─────────────────────────────────────────────────────────────

const WINDOW_MS  = 60_000; // 60-second rolling window
const AUTH_LIMIT = 15;     // requests per window for authenticated chat users
const ANON_LIMIT = 8;      // requests per window for anonymous chat users

// Auth-endpoint limits — tighter to resist brute-force and email flooding
const LOGIN_LIMIT         = 10; // login attempts per IP per window
const REGISTER_LIMIT      = 5;  // registrations per IP per window
const PASSWORD_RESET_LIMIT = 5; // forgot/reset requests per IP per window

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

function check(key: string, limit: number): RateLimitResult {
  const now         = Date.now();
  const windowStart = now - WINDOW_MS;
  const timestamps  = (store.get(key) ?? []).filter(t => t > windowStart);

  if (timestamps.length >= limit) {
    const retryAfter = Math.ceil((timestamps[0] + WINDOW_MS - now) / 1000);
    return { allowed: false, retryAfter };
  }

  timestamps.push(now);
  store.set(key, timestamps);
  return { allowed: true };
}

/**
 * Chat endpoint — authenticated users get a higher limit than anonymous.
 * @param key    - userId for authenticated users, IP for anonymous
 * @param isAnon - Whether the caller is unauthenticated
 */
export function checkRateLimit(key: string, isAnon: boolean): RateLimitResult {
  return check(key, isAnon ? ANON_LIMIT : AUTH_LIMIT);
}

/** Login endpoint — keyed by IP to resist password brute-force. */
export function checkLoginRateLimit(ip: string): RateLimitResult {
  return check(`login:${ip}`, LOGIN_LIMIT);
}

/** Registration endpoint — keyed by IP to resist bulk account creation. */
export function checkRegisterRateLimit(ip: string): RateLimitResult {
  return check(`register:${ip}`, REGISTER_LIMIT);
}

/** Forgot-password / reset-password — keyed by IP to resist email flooding. */
export function checkPasswordResetRateLimit(ip: string): RateLimitResult {
  return check(`pwreset:${ip}`, PASSWORD_RESET_LIMIT);
}
