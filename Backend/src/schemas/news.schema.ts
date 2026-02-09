import { z } from 'zod';

export const newsQuerySchema = z.object({
  q: z.string().max(200).default('movies OR film OR cinema'),
  page: z.coerce.number().int().min(1).max(100).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  from: z.string().optional(),
  to: z.string().optional(),
  language: z.string().max(5).default('en'),
});
