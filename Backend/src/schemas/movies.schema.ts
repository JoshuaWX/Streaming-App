import { z } from 'zod';

export const trendingQuerySchema = z.object({
  page: z.coerce.number().int().min(1).max(500).default(1),
  time_window: z.enum(['day', 'week']).default('day'),
});

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).max(500).default(1),
});

export const movieIdParamSchema = z.object({
  tmdbId: z.coerce.number().int().positive(),
});
