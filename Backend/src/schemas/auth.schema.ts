import { z } from 'zod';

// Not much to validate since Supabase handles auth, but useful for future endpoints
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(128),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
});
