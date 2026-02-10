import { getSupabaseAdmin } from '../config/supabase';
import { ApiError } from '../utils/ApiError';

export interface Favourite {
  id: string;
  user_id: string;
  tmdb_id: number;
  title: string | null;
  poster_path: string | null;
  created_at: string;
}

const supabase = () => getSupabaseAdmin();

export async function listFavourites(userId: string): Promise<Favourite[]> {
  const { data, error } = await supabase()
    .from('favourites')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw ApiError.internal(error.message);
  return data as Favourite[];
}

export async function addFavourite(
  userId: string,
  tmdbId: number,
  title?: string,
  posterPath?: string,
): Promise<Favourite> {
  const { data, error } = await supabase()
    .from('favourites')
    .insert({
      user_id: userId,
      tmdb_id: tmdbId,
      title: title ?? null,
      poster_path: posterPath ?? null,
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') throw ApiError.conflict('Movie already in favourites');
    throw ApiError.internal(error.message);
  }
  return data as Favourite;
}

export async function removeFavourite(userId: string, tmdbId: number): Promise<void> {
  const { error, count } = await supabase()
    .from('favourites')
    .delete({ count: 'exact' })
    .eq('user_id', userId)
    .eq('tmdb_id', tmdbId);

  if (error) throw ApiError.internal(error.message);
  if (count === 0) throw ApiError.notFound('Favourite not found');
}
