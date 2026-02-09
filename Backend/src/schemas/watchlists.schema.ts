import { z } from 'zod';

export const createWatchlistSchema = z.object({
  name: z.string().min(1).max(100).trim(),
});

export const updateWatchlistSchema = z.object({
  name: z.string().min(1).max(100).trim(),
});

export const addWatchlistItemSchema = z.object({
  tmdb_movie_id: z.number().int().positive(),
  title: z.string().max(500).optional(),
  poster_path: z.string().max(500).optional(),
});

export const watchlistIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const watchlistItemParamSchema = z.object({
  id: z.string().uuid(),
  itemId: z.string().uuid(),
});

export const watchlistPaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
