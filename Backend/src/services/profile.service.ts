import { getSupabaseAdmin } from '../config/supabase';
import { ApiError } from '../utils/ApiError';
import type { Profile } from '../types';

const supabase = () => getSupabaseAdmin();

export async function getProfileById(userId: string): Promise<Profile> {
  const { data, error } = await supabase()
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) throw ApiError.notFound('Profile not found');
  return data as Profile;
}

export async function updateProfileRole(
  userId: string,
  role: 'user' | 'admin'
): Promise<Profile> {
  const { data, error } = await supabase()
    .from('profiles')
    .update({ role })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw ApiError.internal(error.message);
  return data as Profile;
}
