import axios, { AxiosInstance } from 'axios';
import { env } from '../config/env';
import { logger } from '../config/logger';
import { ApiError } from '../utils/ApiError';
import { cacheGet, cacheSet, CacheTTL } from './cache.service';
import type { TmdbMovieDetail, PaginatedResponse, TmdbMovie } from '../types';

const tmdb: AxiosInstance = axios.create({
  baseURL: env.TMDB_BASE_URL,
  timeout: 10_000,
  headers: {
    Accept: 'application/json',
    Authorization: `Bearer ${env.TMDB_ACCESS_TOKEN}`,
  },
});

// Response interceptor – never leak API keys in errors
tmdb.interceptors.response.use(
  (res) => res,
  (err) => {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      logger.error({ status, url: err.config?.url }, 'TMDB API error');
      if (status === 404) throw ApiError.notFound('Movie not found on TMDB');
      if (status === 429) throw ApiError.tooManyRequests('TMDB rate limit exceeded');
      if (err.code === 'ECONNABORTED') throw ApiError.gatewayTimeout('TMDB request timed out');
      throw ApiError.badGateway('TMDB service unavailable');
    }
    throw err;
  }
);

/**
 * GET /trending/movie/{time_window}
 */
export async function getTrending(
  timeWindow: 'day' | 'week',
  page: number
): Promise<PaginatedResponse<TmdbMovie>> {
  const cacheKey = 'movies:trending';
  const params = { timeWindow, page };
  const cached = await cacheGet<PaginatedResponse<TmdbMovie>>(cacheKey, params);
  if (cached) return cached;

  const { data } = await tmdb.get(`/trending/movie/${timeWindow}`, {
    params: { page },
  });

  const result: PaginatedResponse<TmdbMovie> = {
    results: data.results,
    page: data.page,
    total_pages: data.total_pages,
    total_results: data.total_results,
  };

  await cacheSet(cacheKey, params, result, CacheTTL.TRENDING);
  return result;
}

/**
 * GET /movie/popular
 */
export async function getPopular(page: number): Promise<PaginatedResponse<TmdbMovie>> {
  const cacheKey = 'movies:popular';
  const params = { page };
  const cached = await cacheGet<PaginatedResponse<TmdbMovie>>(cacheKey, params);
  if (cached) return cached;

  const { data } = await tmdb.get('/movie/popular', { params: { page } });

  const result: PaginatedResponse<TmdbMovie> = {
    results: data.results,
    page: data.page,
    total_pages: data.total_pages,
    total_results: data.total_results,
  };

  await cacheSet(cacheKey, params, result, CacheTTL.POPULAR);
  return result;
}

/**
 * GET /movie/top_rated
 */
export async function getTopRated(page: number): Promise<PaginatedResponse<TmdbMovie>> {
  const cacheKey = 'movies:top_rated';
  const params = { page };
  const cached = await cacheGet<PaginatedResponse<TmdbMovie>>(cacheKey, params);
  if (cached) return cached;

  const { data } = await tmdb.get('/movie/top_rated', { params: { page } });

  const result: PaginatedResponse<TmdbMovie> = {
    results: data.results,
    page: data.page,
    total_pages: data.total_pages,
    total_results: data.total_results,
  };

  await cacheSet(cacheKey, params, result, CacheTTL.TOP_RATED);
  return result;
}

/**
 * GET /movie/{id} with credits and videos appended.
 */
export async function getMovieDetail(tmdbId: number): Promise<TmdbMovieDetail> {
  const cacheKey = 'movies:detail';
  const params = { tmdbId };
  const cached = await cacheGet<TmdbMovieDetail>(cacheKey, params);
  if (cached) return cached;

  const { data } = await tmdb.get(`/movie/${tmdbId}`, {
    params: { append_to_response: 'credits,videos' },
  });

  await cacheSet(cacheKey, params, data, CacheTTL.MOVIE_DETAIL);
  return data as TmdbMovieDetail;
}

/**
 * GET /movie/{id}/recommendations
 */
export async function getRecommendations(
  tmdbId: number,
  page: number
): Promise<PaginatedResponse<TmdbMovie>> {
  const cacheKey = 'movies:recommendations';
  const params = { tmdbId, page };
  const cached = await cacheGet<PaginatedResponse<TmdbMovie>>(cacheKey, params);
  if (cached) return cached;

  const { data } = await tmdb.get(`/movie/${tmdbId}/recommendations`, {
    params: { page },
  });

  const result: PaginatedResponse<TmdbMovie> = {
    results: data.results,
    page: data.page,
    total_pages: data.total_pages,
    total_results: data.total_results,
  };

  await cacheSet(cacheKey, params, result, CacheTTL.RECOMMENDATIONS);
  return result;
}

/**
 * GET /search/movie
 */
export async function searchMovies(
  query: string,
  page: number,
  year?: number,
  includeAdult = false
): Promise<PaginatedResponse<TmdbMovie>> {
  const cacheKey = 'search:movies';
  const params = { query, page, year, includeAdult };
  const cached = await cacheGet<PaginatedResponse<TmdbMovie>>(cacheKey, params);
  if (cached) return cached;

  const { data } = await tmdb.get('/search/movie', {
    params: {
      query,
      page,
      ...(year ? { year } : {}),
      include_adult: includeAdult,
    },
  });

  const result: PaginatedResponse<TmdbMovie> = {
    results: data.results,
    page: data.page,
    total_pages: data.total_pages,
    total_results: data.total_results,
  };

  await cacheSet(cacheKey, params, result, CacheTTL.SEARCH);
  return result;
}
