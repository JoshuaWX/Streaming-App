import { Request, Response, NextFunction } from 'express';
import { getSupabaseAdmin } from '../config/supabase';
import { ApiError } from '../utils/ApiError';
import { logger } from '../config/logger';

/**
 * Middleware: Verify Supabase JWT and attach user to req.
 */
export async function requireAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Missing or malformed Authorization header');
    }

    const token = authHeader.slice(7);
    if (!token) {
      throw ApiError.unauthorized('Token is empty');
    }

    const supabase = getSupabaseAdmin();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      logger.debug({ error }, 'JWT verification failed');
      throw ApiError.unauthorized('Invalid or expired token');
    }

    // Fetch profile for role information
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    req.user = {
      id: user.id,
      email: user.email ?? '',
      role: (profile?.role as 'user' | 'admin') ?? 'user',
    };

    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Middleware factory: Require a specific role.
 */
export function requireRole(...roles: Array<'user' | 'admin'>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(ApiError.unauthorized());
    }
    if (!roles.includes(req.user.role)) {
      return next(ApiError.forbidden(`Requires role: ${roles.join(' or ')}`));
    }
    next();
  };
}

/**
 * Optional authentication – sets req.user if token present but doesn't fail.
 */
export async function optionalAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.slice(7);
    if (!token) {
      return next();
    }

    const supabase = getSupabaseAdmin();
    const {
      data: { user },
    } = await supabase.auth.getUser(token);

    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      req.user = {
        id: user.id,
        email: user.email ?? '',
        role: (profile?.role as 'user' | 'admin') ?? 'user',
      };
    }

    next();
  } catch {
    // Non-fatal – proceed without user
    next();
  }
}
