import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Supabase
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  // TMDB
  TMDB_API_KEY: z.string().min(1),
  TMDB_ACCESS_TOKEN: z.string().min(1),
  TMDB_BASE_URL: z.string().url().default('https://api.themoviedb.org/3'),

  // NewsAPI
  NEWS_API_KEY: z.string().min(1),
  NEWS_API_BASE_URL: z.string().url().default('https://newsapi.org/v2'),

  // Redis
  REDIS_URL: z.string().default('redis://localhost:6379'),
  CACHE_ENABLED: z
    .string()
    .transform((v) => v === 'true')
    .default('true'),

  // CORS
  CORS_ORIGINS: z
    .string()
    .default('http://localhost:3000')
    .transform((v) => v.split(',')),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900_000),
  RATE_LIMIT_MAX: z.coerce.number().default(100),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
