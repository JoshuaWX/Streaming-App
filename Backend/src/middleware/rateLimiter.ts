import rateLimit, { type Options } from 'express-rate-limit';
import type { Request } from 'express';
import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';

/* ------------------------------------------------------------------ */
/*  Shared defaults                                                    */
/* ------------------------------------------------------------------ */
const baseOptions: Partial<Options> = {
  standardHeaders: true, // Return `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
};

/* ------------------------------------------------------------------ */
/*  1. Global (IP-based) — applied to every request                    */
/*     Guards against raw traffic floods from a single IP.             */
/* ------------------------------------------------------------------ */
export const globalRateLimiter = rateLimit({
  ...baseOptions,
  windowMs: env.RATE_LIMIT_WINDOW_MS, // default 15 min
  max: env.RATE_LIMIT_MAX, // default 100
  handler: (_req, _res, next) => {
    next(ApiError.tooManyRequests('Rate limit exceeded. Please try again later.'));
  },
});

/* ------------------------------------------------------------------ */
/*  2. Auth endpoints (IP-based, strict) — login / signup              */
/*     Prevents brute-force & credential-stuffing attacks.             */
/* ------------------------------------------------------------------ */
export const authRateLimiter = rateLimit({
  ...baseOptions,
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 attempts per window
  handler: (_req, _res, next) => {
    next(ApiError.tooManyRequests('Too many authentication attempts. Please try again later.'));
  },
});

/* ------------------------------------------------------------------ */
/*  3. Authenticated API (user-based) — general authed routes          */
/*     Each *user* gets their own bucket (keyed by user-id from JWT).  */
/*     Falls back to IP if the token is somehow missing.               */
/* ------------------------------------------------------------------ */
export const userRateLimiter = rateLimit({
  ...baseOptions,
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // generous per-user budget
  keyGenerator: (req: Request) => req.user?.id ?? req.ip ?? 'unknown',
  handler: (_req, _res, next) => {
    next(ApiError.tooManyRequests('You are making too many requests. Please slow down.'));
  },
});

/* ------------------------------------------------------------------ */
/*  4. Sensitive writes (user-based, tight) — favourites / watchlists  */
/*     Prevents spam-toggling or abuse of mutation endpoints.          */
/* ------------------------------------------------------------------ */
export const writeRateLimiter = rateLimit({
  ...baseOptions,
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 writes per minute per user
  keyGenerator: (req: Request) => req.user?.id ?? req.ip ?? 'unknown',
  handler: (_req, _res, next) => {
    next(ApiError.tooManyRequests('Too many write requests. Please slow down.'));
  },
});
