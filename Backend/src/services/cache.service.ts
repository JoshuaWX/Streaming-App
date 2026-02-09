import crypto from 'crypto';
import { getRedis } from '../config/redis';
import { env } from '../config/env';
import { logger } from '../config/logger';

/**
 * Generate a deterministic cache key from route + params.
 */
function buildKey(prefix: string, params: Record<string, unknown>): string {
  const hash = crypto
    .createHash('sha256')
    .update(JSON.stringify(params))
    .digest('hex')
    .slice(0, 16);
  return `cache:v1:${prefix}:${hash}`;
}

/**
 * Get a cached value.
 */
export async function cacheGet<T>(prefix: string, params: Record<string, unknown>): Promise<T | null> {
  if (!env.CACHE_ENABLED) return null;

  const redis = getRedis();
  if (!redis) return null;

  try {
    const key = buildKey(prefix, params);
    const raw = await redis.get(key);
    if (raw) {
      logger.debug({ key }, 'Cache HIT');
      return JSON.parse(raw) as T;
    }
    logger.debug({ key }, 'Cache MISS');
    return null;
  } catch (err) {
    logger.warn({ err }, 'Cache get failed');
    return null;
  }
}

/**
 * Set a cached value with TTL in seconds.
 */
export async function cacheSet(
  prefix: string,
  params: Record<string, unknown>,
  data: unknown,
  ttlSeconds: number
): Promise<void> {
  if (!env.CACHE_ENABLED) return;

  const redis = getRedis();
  if (!redis) return;

  try {
    const key = buildKey(prefix, params);
    await redis.setex(key, ttlSeconds, JSON.stringify(data));
    logger.debug({ key, ttlSeconds }, 'Cache SET');
  } catch (err) {
    logger.warn({ err }, 'Cache set failed');
  }
}

/**
 * Delete cached entries matching a prefix pattern.
 */
export async function cacheInvalidate(prefix: string): Promise<void> {
  const redis = getRedis();
  if (!redis) return;

  try {
    const pattern = `cache:v1:${prefix}:*`;
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
      logger.debug({ pattern, count: keys.length }, 'Cache INVALIDATED');
    }
  } catch (err) {
    logger.warn({ err }, 'Cache invalidate failed');
  }
}

// TTL constants (seconds)
export const CacheTTL = {
  MOVIE_DETAIL: 6 * 60 * 60,    // 6 hours
  TRENDING: 15 * 60,             // 15 minutes
  POPULAR: 30 * 60,              // 30 minutes
  TOP_RATED: 30 * 60,            // 30 minutes
  RECOMMENDATIONS: 60 * 60,     // 1 hour
  SEARCH: 5 * 60,               // 5 minutes
  NEWS: 30 * 60,                // 30 minutes
} as const;
