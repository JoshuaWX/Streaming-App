-- ============================================================
-- Favourites table
-- ============================================================

CREATE TABLE IF NOT EXISTS public.favourites (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tmdb_id     INTEGER NOT NULL,
  title       TEXT,
  poster_path TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, tmdb_id)
);

CREATE INDEX IF NOT EXISTS idx_favourites_user_id ON public.favourites(user_id);

-- ── Row Level Security ─────────────────────────────────────
ALTER TABLE public.favourites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own favourites"
  ON public.favourites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favourites"
  ON public.favourites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favourites"
  ON public.favourites FOR DELETE
  USING (auth.uid() = user_id);
