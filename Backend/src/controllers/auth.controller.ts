import { Request, Response } from 'express';
import { getProfileById } from '../services/profile.service';
import { asyncHandler } from '../utils/asyncHandler';

/**
 * GET /auth/me – return the authenticated user's profile.
 */
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user!;
  const profile = await getProfileById(user.id);
  res.json({ data: profile });
});
