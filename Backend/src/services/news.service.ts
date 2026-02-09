import axios, { AxiosInstance } from 'axios';
import { env } from '../config/env';
import { logger } from '../config/logger';
import { ApiError } from '../utils/ApiError';
import { cacheGet, cacheSet, CacheTTL } from './cache.service';
import type { NewsArticle } from '../types';

const newsApi: AxiosInstance = axios.create({
  baseURL: env.NEWS_API_BASE_URL,
  timeout: 10_000,
  headers: { 'X-Api-Key': env.NEWS_API_KEY },
});

newsApi.interceptors.response.use(
  (res) => res,
  (err) => {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      logger.error({ status, url: err.config?.url }, 'NewsAPI error');
      if (status === 429) throw ApiError.tooManyRequests('NewsAPI rate limit exceeded');
      if (err.code === 'ECONNABORTED') throw ApiError.gatewayTimeout('NewsAPI request timed out');
      throw ApiError.badGateway('NewsAPI service unavailable');
    }
    throw err;
  }
);

interface NewsApiArticle {
  title: string;
  url: string;
  source: { name: string };
  publishedAt: string;
  urlToImage: string | null;
  description: string | null;
}

interface GetNewsParams {
  q: string;
  page: number;
  pageSize: number;
  from?: string;
  to?: string;
  language: string;
}

export async function getNews(
  params: GetNewsParams
): Promise<{ articles: NewsArticle[]; totalResults: number }> {
  const cacheKey = 'news';
  const cached = await cacheGet<{ articles: NewsArticle[]; totalResults: number }>(
    cacheKey,
    params as unknown as Record<string, unknown>
  );
  if (cached) return cached;

  const { data } = await newsApi.get('/everything', {
    params: {
      q: params.q,
      page: params.page,
      pageSize: params.pageSize,
      language: params.language,
      sortBy: 'publishedAt',
      ...(params.from ? { from: params.from } : {}),
      ...(params.to ? { to: params.to } : {}),
    },
  });

  // Normalize to our frontend-friendly schema
  const articles: NewsArticle[] = (data.articles as NewsApiArticle[]).map((a) => ({
    title: a.title,
    url: a.url,
    source: a.source.name,
    publishedAt: a.publishedAt,
    imageUrl: a.urlToImage,
    summary: a.description,
  }));

  const result = { articles, totalResults: data.totalResults as number };
  await cacheSet(cacheKey, params as unknown as Record<string, unknown>, result, CacheTTL.NEWS);
  return result;
}
