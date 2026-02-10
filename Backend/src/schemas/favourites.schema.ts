import { z } from 'zod';

export const addFavouriteSchema = z.object({
  tmdb_id: z.number().int().positive(),
  title: z.string().max(500).optional(),
  poster_path: z.string().max(500).optional(),
});

export const removeFavouriteParamSchema = z.object({
  tmdb_id: z.coerce.number().int().positive(),
});
