/**
 * Utility functions for TMDB image URLs and data transformation.
 */

const TMDB_IMAGE_BASE = process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE || 'https://image.tmdb.org/t/p';

/** Poster sizes: w92, w154, w185, w342, w500, w780, original */
export function posterUrl(path: string | null, size: string = 'w500'): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

/** Backdrop sizes: w300, w780, w1280, original */
export function backdropUrl(path: string | null, size: string = 'w1280'): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

/** Profile sizes: w45, w185, h632, original */
export function profileUrl(path: string | null, size: string = 'w185'): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

/** Extract year from TMDB release_date string "2024-05-15" → 2024 */
export function extractYear(releaseDate: string | undefined): number {
  if (!releaseDate) return 0;
  return parseInt(releaseDate.substring(0, 4), 10) || 0;
}

/** Format runtime minutes to "Xh Ym" */
export function formatRuntime(minutes: number | null): string {
  if (!minutes) return 'N/A';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

/** Get maturity rating string from adult flag */
export function maturityRating(adult: boolean): string {
  return adult ? 'R' : 'PG-13';
}

/**
 * TMDB genre_id → name mapping (common genres).
 * Used for list views where only genre_ids are available.
 */
export const GENRE_MAP: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

/** Convert genre_ids array to genre name strings */
export function genreIdsToNames(genreIds: number[] | undefined): string[] {
  if (!genreIds) return [];
  return genreIds.map((id) => GENRE_MAP[id] || 'Unknown').filter(Boolean);
}

/**
 * Gradient color palette for movies without poster images.
 * Deterministic based on movie ID.
 */
const GRADIENT_COLORS = [
  'from-blue-600 to-purple-600',
  'from-cyan-600 to-blue-600',
  'from-purple-900 to-red-900',
  'from-green-600 to-cyan-600',
  'from-amber-700 to-red-700',
  'from-red-700 to-pink-600',
  'from-indigo-600 to-purple-600',
  'from-teal-600 to-green-600',
  'from-orange-700 to-red-600',
  'from-pink-600 to-purple-600',
];

/** Get a deterministic gradient color for a given TMDB id */
export function gradientForId(id: number): string {
  return GRADIENT_COLORS[id % GRADIENT_COLORS.length];
}
