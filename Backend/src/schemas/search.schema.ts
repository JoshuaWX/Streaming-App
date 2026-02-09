import { z } from 'zod';

export const searchQuerySchema = z.object({
  q: z.string().min(1).max(200),
  page: z.coerce.number().int().min(1).max(500).default(1),
  year: z.coerce.number().int().min(1900).max(2100).optional(),
  include_adult: z
    .string()
    .transform((v) => v === 'true')
    .default('false'),
});
