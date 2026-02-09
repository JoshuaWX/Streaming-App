import { getSupabaseAdmin } from '../config/supabase';
import { ApiError } from '../utils/ApiError';
import type { Watchlist, WatchlistItem } from '../types';

const supabase = () => getSupabaseAdmin();

// ── Watchlists ─────────────────────────────────────────────

export async function getUserWatchlists(userId: string): Promise<Watchlist[]> {
  const { data, error } = await supabase()
    .from('watchlists')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw ApiError.internal(error.message);
  return data as Watchlist[];
}

export async function createWatchlist(userId: string, name: string): Promise<Watchlist> {
  const { data, error } = await supabase()
    .from('watchlists')
    .insert({ user_id: userId, name })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') throw ApiError.conflict('Watchlist name already exists');
    throw ApiError.internal(error.message);
  }
  return data as Watchlist;
}

export async function getWatchlistById(
  userId: string,
  watchlistId: string
): Promise<Watchlist> {
  const { data, error } = await supabase()
    .from('watchlists')
    .select('*')
    .eq('id', watchlistId)
    .eq('user_id', userId)
    .single();

  if (error || !data) throw ApiError.notFound('Watchlist not found');
  return data as Watchlist;
}

export async function updateWatchlist(
  userId: string,
  watchlistId: string,
  name: string
): Promise<Watchlist> {
  // Ownership check
  await getWatchlistById(userId, watchlistId);

  const { data, error } = await supabase()
    .from('watchlists')
    .update({ name })
    .eq('id', watchlistId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw ApiError.internal(error.message);
  return data as Watchlist;
}

export async function deleteWatchlist(userId: string, watchlistId: string): Promise<void> {
  await getWatchlistById(userId, watchlistId);

  const { error } = await supabase()
    .from('watchlists')
    .delete()
    .eq('id', watchlistId)
    .eq('user_id', userId);

  if (error) throw ApiError.internal(error.message);
}

// ── Watchlist Items ────────────────────────────────────────

export async function getWatchlistItems(
  userId: string,
  watchlistId: string,
  page: number,
  limit: number
): Promise<{ items: WatchlistItem[]; total: number }> {
  // Ownership check
  await getWatchlistById(userId, watchlistId);

  const offset = (page - 1) * limit;

  const { data, error, count } = await supabase()
    .from('watchlist_items')
    .select('*', { count: 'exact' })
    .eq('watchlist_id', watchlistId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw ApiError.internal(error.message);
  return { items: data as WatchlistItem[], total: count ?? 0 };
}

export async function addWatchlistItem(
  userId: string,
  watchlistId: string,
  tmdbMovieId: number,
  title?: string,
  posterPath?: string
): Promise<WatchlistItem> {
  // Ownership check
  await getWatchlistById(userId, watchlistId);

  const { data, error } = await supabase()
    .from('watchlist_items')
    .insert({
      watchlist_id: watchlistId,
      tmdb_movie_id: tmdbMovieId,
      title: title ?? null,
      poster_path: posterPath ?? null,
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') throw ApiError.conflict('Movie already in watchlist');
    throw ApiError.internal(error.message);
  }
  return data as WatchlistItem;
}

export async function removeWatchlistItem(
  userId: string,
  watchlistId: string,
  itemId: string
): Promise<void> {
  // Ownership check
  await getWatchlistById(userId, watchlistId);

  const { error } = await supabase()
    .from('watchlist_items')
    .delete()
    .eq('id', itemId)
    .eq('watchlist_id', watchlistId);

  if (error) throw ApiError.internal(error.message);
}
