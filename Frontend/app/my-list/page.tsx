'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import MovieCard from '@/components/movie-card'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/auth-context'
import {
  fetchWatchlists,
  fetchWatchlistItems,
  removeFromWatchlist,
  createWatchlist,
  type WatchlistItemApi,
  type WatchlistApi,
} from '@/lib/api'

type SortOption = 'recently-added' | 'title'

export default function MyListPage() {
  const { user, loading: authLoading } = useAuth()
  const [watchlist, setWatchlist] = useState<WatchlistApi | null>(null)
  const [items, setItems] = useState<WatchlistItemApi[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<SortOption>('recently-added')

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      setLoading(false)
      return
    }

    async function loadList() {
      try {
        let lists = await fetchWatchlists()
        let wl = lists[0]
        if (!wl) {
          wl = await createWatchlist('My List')
        }
        setWatchlist(wl)
        const wlItems = await fetchWatchlistItems(wl.id)
        setItems(wlItems)
      } catch (err) {
        console.error('Failed to load list:', err)
      } finally {
        setLoading(false)
      }
    }
    loadList()
  }, [user, authLoading])

  const handleRemove = async (itemId: string) => {
    if (!watchlist) return
    try {
      await removeFromWatchlist(watchlist.id, itemId)
      setItems(items.filter((item) => item.id !== itemId))
    } catch (err) {
      console.error('Failed to remove:', err)
    }
  }

  const sortedItems = [...items].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return (a.title || '').localeCompare(b.title || '')
      case 'recently-added':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }
  })

  if (!authLoading && !user) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📭</div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Sign in to access your list</h2>
          <p className="text-muted-foreground mb-8">Create an account or sign in to save movies.</p>
          <Link href="/login">
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">Sign In</Button>
          </Link>
        </div>
      </main>
    )
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground text-lg">Loading your list...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-card to-background py-16 px-4 md:px-8 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">My List</h1>
          <p className="text-muted-foreground text-lg">
            {items.length} {items.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {sortedItems.length > 0 ? (
          <>
            {/* Sort Options */}
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="text-muted-foreground text-sm self-center">Sort by:</span>
              {(['recently-added', 'title'] as const).map((option) => (
                <Button
                  key={option}
                  onClick={() => setSortBy(option)}
                  variant={sortBy === option ? 'default' : 'outline'}
                  className={`text-sm capitalize ${
                    sortBy === option
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-input border-border text-foreground hover:bg-input/80'
                  }`}
                >
                  {option.replace('-', ' ')}
                </Button>
              ))}
            </div>

            {/* Movies Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedItems.map((item) => (
                <div key={item.id} className="relative group">
                  <MovieCard
                    id={item.tmdb_movie_id}
                    title={item.title || 'Untitled'}
                    rating={0}
                    year={0}
                    posterPath={item.poster_path}
                  />
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 hover:bg-red-700 text-white rounded-full p-2 z-10"
                    aria-label="Remove from list"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">Your list is empty</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Start adding movies and TV shows to your list to keep track of what you want to watch.
            </p>
            <Link href="/">
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Browse Content
              </Button>
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
