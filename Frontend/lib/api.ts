import axios from 'axios';
import { supabase } from './supabase';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api/v1';

/**
 * Axios instance pre-configured for our backend API.
 * Automatically attaches Supabase JWT if the user is logged in.
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach auth token
api.interceptors.request.use(async (config) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
  } catch {
    // No session — continue without auth
  }
  return config;
});

// Response interceptor: unwrap backend { data: ... } envelope & normalize errors
api.interceptors.response.use(
  (res) => {
    // Backend wraps every response in { data: ... } — unwrap it so callers
    // receive the inner payload directly.
    if (res.data && typeof res.data === 'object' && 'data' in res.data) {
      res.data = (res.data as Record<string, unknown>).data;
    }
    return res;
  },
  (err) => {
    if (axios.isAxiosError(err) && err.response) {
      const message =
        err.response.data?.error?.message || err.response.statusText || 'Request failed';
      return Promise.reject(new Error(message));
    }
    return Promise.reject(err);
  }
);

export default api;

// ─── Movie API ───────────────────────────────────────────────

export interface PaginatedResponse<T> {
  results: T[];
  page: number;
  total_pages: number;
  total_results: number;
}

export async function fetchTrending(timeWindow: 'day' | 'week' = 'day', page = 1) {
  const { data } = await api.get<PaginatedResponse<TmdbMovie>>('/movies/trending', {
    params: { time_window: timeWindow, page },
  });
  return data;
}

export async function fetchPopular(page = 1) {
  const { data } = await api.get<PaginatedResponse<TmdbMovie>>('/movies/popular', {
    params: { page },
  });
  return data;
}

export async function fetchTopRated(page = 1) {
  const { data } = await api.get<PaginatedResponse<TmdbMovie>>('/movies/top-rated', {
    params: { page },
  });
  return data;
}

export async function fetchMovieDetail(tmdbId: number) {
  const { data } = await api.get<TmdbMovieDetail>(`/movies/${tmdbId}`);
  return data;
}

export async function fetchRecommendations(tmdbId: number, page = 1) {
  const { data } = await api.get<PaginatedResponse<TmdbMovie>>(
    `/movies/${tmdbId}/recommendations`,
    { params: { page } }
  );
  return data;
}

export async function fetchSimilarMovies(tmdbId: number, page = 1) {
  const { data } = await api.get<PaginatedResponse<TmdbMovie>>(
    `/movies/${tmdbId}/similar`,
    { params: { page } }
  );
  return data;
}

export async function fetchDirectorMovies(tmdbId: number) {
  const { data } = await api.get<TmdbMovie[]>(`/movies/${tmdbId}/director-movies`);
  return data;
}

export async function searchMovies(query: string, page = 1, year?: number) {
  const { data } = await api.get<PaginatedResponse<TmdbMovie>>('/search/movies', {
    params: { q: query, page, ...(year ? { year } : {}) },
  });
  return data;
}

export async function fetchCastDetail(castId: number) {
  const { data } = await api.get<TmdbCastDetail>(`/cast/${castId}`);
  return data;
}

export async function fetchCastMovies(castId: number) {
  const { data } = await api.get<{ cast: TmdbMovie[] }>(`/cast/${castId}/movies`);
  return data;
}

// ─── News API ────────────────────────────────────────────────

export interface NewsArticleApi {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  imageUrl: string | null;
  summary: string | null;
}

export interface NewsResponse {
  articles: NewsArticleApi[];
  pagination: { page: number; pageSize: number; totalResults: number; totalPages: number };
}

export async function fetchNews(page = 1, pageSize = 20) {
  const { data } = await api.get<NewsResponse>('/news', {
    params: { page, pageSize },
  });
  return data;
}

// ─── Watchlist API ───────────────────────────────────────────

export interface WatchlistApi {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface WatchlistItemApi {
  id: string;
  watchlist_id: string;
  tmdb_movie_id: number;
  title: string | null;
  poster_path: string | null;
  created_at: string;
}

export async function fetchWatchlists() {
  const { data } = await api.get<WatchlistApi[]>('/watchlists');
  return data;
}

export async function createWatchlist(name: string) {
  const { data } = await api.post<WatchlistApi>('/watchlists', { name });
  return data;
}

export async function fetchWatchlistItems(watchlistId: string) {
  const { data } = await api.get<{ items: WatchlistItemApi[]; pagination: unknown }>(
    `/watchlists/${watchlistId}`
  );
  // GET /watchlists/:id returns the watchlist with embedded items
  return ((data as Record<string, unknown>).items ?? []) as WatchlistItemApi[];
}

export async function addToWatchlist(watchlistId: string, tmdbMovieId: number, title?: string, posterPath?: string) {
  const { data } = await api.post<WatchlistItemApi>(`/watchlists/${watchlistId}/items`, {
    tmdb_movie_id: tmdbMovieId,
    title,
    poster_path: posterPath,
  });
  return data;
}

export async function removeFromWatchlist(watchlistId: string, itemId: string) {
  await api.delete(`/watchlists/${watchlistId}/items/${itemId}`);
}

// ─── Auth API ────────────────────────────────────────────────

export async function fetchCurrentUser() {
  const { data } = await api.get('/auth/me');
  return data;
}

// ─── TMDB Types (mirrors backend) ────────────────────────────

export interface TmdbMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
  popularity: number;
  adult: boolean;
  original_language: string;
}

export interface TmdbMovieDetail extends TmdbMovie {
  runtime: number | null;
  budget: number;
  revenue: number;
  tagline: string;
  status: string;
  genres: { id: number; name: string }[];
  production_companies: { id: number; name: string; logo_path: string | null }[];
  production_countries: { iso_3166_1: string; name: string }[];
  spoken_languages: { english_name: string; iso_639_1: string; name: string }[];
  credits?: { cast: TmdbCastMember[]; crew: TmdbCrewMember[] };
  videos?: { results: TmdbVideo[] };
}

export interface TmdbCastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface TmdbCrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface TmdbVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface TmdbCastDetail {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  gender: number;
  known_for_department: string;
  place_of_birth: string | null;
  profile_path: string | null;
  popularity: number;
}
