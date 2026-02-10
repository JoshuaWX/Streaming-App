'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './auth-context';
import {
  fetchFavourites,
  addFavourite as apiAdd,
  removeFavourite as apiRemove,
  type FavouriteApi,
} from '@/lib/api';

interface FavouritesContextValue {
  /** Set of tmdb_ids the user has favourited */
  favouriteIds: Set<number>;
  /** Full favourite records */
  favourites: FavouriteApi[];
  /** True while the initial list is loading */
  loading: boolean;
  /** Add a movie – optimistic UI */
  add: (tmdbId: number, title?: string, posterPath?: string) => Promise<void>;
  /** Remove a movie – optimistic UI */
  remove: (tmdbId: number) => Promise<void>;
  /** Check if a movie is favourited */
  isFavourited: (tmdbId: number) => boolean;
}

const FavouritesContext = createContext<FavouritesContextValue | undefined>(undefined);

export function FavouritesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [favourites, setFavourites] = useState<FavouriteApi[]>([]);
  const [favouriteIds, setFavouriteIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);

  // Load favourites when user changes
  useEffect(() => {
    if (!user) {
      setFavourites([]);
      setFavouriteIds(new Set());
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetchFavourites()
      .then((data) => {
        if (cancelled) return;
        setFavourites(data);
        setFavouriteIds(new Set(data.map((f) => f.tmdb_id)));
      })
      .catch((err) => {
        if (!cancelled) console.error('Failed to load favourites:', err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  const isFavourited = useCallback(
    (tmdbId: number) => favouriteIds.has(tmdbId),
    [favouriteIds],
  );

  const add = useCallback(
    async (tmdbId: number, title?: string, posterPath?: string) => {
      // Optimistic update
      setFavouriteIds((prev) => new Set(prev).add(tmdbId));

      try {
        const fav = await apiAdd(tmdbId, title, posterPath);
        setFavourites((prev) => [fav, ...prev]);
      } catch (err) {
        // Rollback
        setFavouriteIds((prev) => {
          const next = new Set(prev);
          next.delete(tmdbId);
          return next;
        });
        throw err;
      }
    },
    [],
  );

  const remove = useCallback(
    async (tmdbId: number) => {
      // Optimistic update
      setFavouriteIds((prev) => {
        const next = new Set(prev);
        next.delete(tmdbId);
        return next;
      });
      const removed = favourites.find((f) => f.tmdb_id === tmdbId);
      setFavourites((prev) => prev.filter((f) => f.tmdb_id !== tmdbId));

      try {
        await apiRemove(tmdbId);
      } catch (err) {
        // Rollback
        if (removed) {
          setFavourites((prev) => [removed, ...prev]);
          setFavouriteIds((prev) => new Set(prev).add(tmdbId));
        }
        throw err;
      }
    },
    [favourites],
  );

  return (
    <FavouritesContext.Provider value={{ favouriteIds, favourites, loading, add, remove, isFavourited }}>
      {children}
    </FavouritesContext.Provider>
  );
}

export function useFavourites() {
  const context = useContext(FavouritesContext);
  if (!context) {
    throw new Error('useFavourites must be used within a FavouritesProvider');
  }
  return context;
}
