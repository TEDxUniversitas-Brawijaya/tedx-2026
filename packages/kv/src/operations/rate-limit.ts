import { KEYS } from "../keys";
import type { KV } from "../kv";

export type RateLimitConfig = {
  /**
   * Maximum number of requests allowed within the window (in minutes)
   */
  maxRequests: number;
  /**
   * Time window in minutes
   */
  windowMinutes: number;
};

export type RateLimitResult = {
  /**
   * Whether the request is allowed
   */
  allowed: boolean;
  /**
   * Number of requests remaining in the current window
   */
  remaining: number;
  /**
   * Number of seconds until the rate limit resets
   */
  retryAfterSeconds?: number;
};

export type RateLimitOperations = {
  /**
   * Check if a request from an IP address is allowed under the rate limit
   * Uses sliding window algorithm
   */
  checkRateLimitByIp(
    ip: string,
    config: RateLimitConfig
  ): Promise<RateLimitResult>;
};

type RateLimitContext = {
  kv: KV;
};

/**
 * Create rate limit operations
 * Implements a sliding window rate limiting algorithm using KV storage
 */
export const createRateLimitOperations = (
  ctx: RateLimitContext
): RateLimitOperations => {
  const { kv } = ctx;

  // Internal helper function for rate limiting with any identifier
  const checkRateLimit = async (
    key: string,
    config: RateLimitConfig
  ): Promise<RateLimitResult> => {
    const now = Date.now();
    const windowMs = config.windowMinutes * 60 * 1000;
    const windowStart = now - windowMs;

    // Get current request timestamps
    const existing = await kv.get(key);
    const timestamps: number[] = existing ? JSON.parse(existing) : [];

    // Filter out timestamps outside the current window (sliding window)
    const validTimestamps = timestamps.filter(
      (timestamp) => timestamp > windowStart
    );

    if (validTimestamps.length >= config.maxRequests) {
      // Calculate retry after (time until oldest request expires)
      const oldestTimestamp = validTimestamps[0];
      const retryAfterMs = oldestTimestamp
        ? oldestTimestamp + windowMs - now
        : 0;
      const retryAfterSeconds = Math.ceil(retryAfterMs / 1000);

      return {
        allowed: false,
        remaining: 0,
        retryAfterSeconds,
      };
    }

    validTimestamps.push(now);

    // Store updated timestamps with TTL (window duration + buffer)
    const ttlSeconds = Math.ceil(windowMs / 1000) + 10;
    await kv.set(key, JSON.stringify(validTimestamps), {
      expirationTtl: ttlSeconds,
    });

    return {
      allowed: true,
      remaining: config.maxRequests - validTimestamps.length,
    };
  };

  return {
    checkRateLimitByIp: (ip, config) => {
      return checkRateLimit(KEYS.rateLimit.ip(ip), config);
    },
  };
};
