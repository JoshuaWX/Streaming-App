'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import MovieCard from '@/components/movie-card'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Clock, Trash2 } from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import {
  fetchWatchlists,
  fetchWatchlistItems,
  removeFromWatchlist,
  createWatchlist,
  type WatchlistItemApi,
  type WatchlistApi,
} from '@/lib/api'

export default function WatchlistPage() {
  const { user, loading: authLoading } = useAuth()
  const [watchlist, setWatchlist] = useState<WatchlistApi | null>(null)
  const [items, setItems] = useState<WatchlistItemApi[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'added' | 'title'>('added')

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      setLoading(false)
      return
    }

    async function loadWatchlist() {
      try {
        let lists = await fetchWatchlists()
        let wl = lists[0]
        if (!wl) {
          // Create default watchlist if none exists
          wl = await createWatchlist('My Watchlist')
        }
        setWatchlist(wl)
        const wlItems = await fetchWatchlistItems(wl.id)
        setItems(wlItems)
      } catch (err) {
        console.error('Failed to load watchlist:', err)
      } finally {
        setLoading(false)
      }
    }
    loadWatchlist()
  }, [user, authLoading])

  const handleRemove = async (itemId: string) => {
    if (!watchlist) return
    try {
      await removeFromWatchlist(watchlist.id, itemId)
      setItems(items.filter((item) => item.id !== itemId))
    } catch (err) {
      console.error('Failed to remove item:', err)
    }
  }

  const sortedItems = [...items].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return (a.title || '').localeCompare(b.title || '')
      case 'added':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }
  })

  if (!authLoading && !user) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Sign in to see your watchlist</h2>
          <p className="text-muted-foreground mb-8">Create an account or sign in to save movies.</p>
          <Link href="/login">
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
              Sign In
            </Button>
          </Link>
        </div>
      </main>
    )
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground text-lg">Loading watchlist...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-card to-background py-12 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-accent-foreground" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">My Watchlist</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Keep track of movies you want to watch
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        {/* Sort Options */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Sort by:</span>
            <div className="flex gap-2 flex-wrap">
              {(['added', 'title'] as const).map((option) => (
                <Button
                  key={option}
                  variant={sortBy === option ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy(option)}
                  className={sortBy === option ? 'bg-accent hover:bg-accent/90 text-accent-foreground' : ''}
                >
                  {option === 'added' ? 'Recently Added' : 'Title'}
                </Button>
              ))}
            </div>
          </div>
          <span className="text-sm text-muted-foreground">{items.length} item(s)</span>
        </div>

        {/* Movies Grid */}
        {sortedItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-12">
            {sortedItems.map((item) => (
              <div key={item.id} className="group relative">
                <MovieCard
                  id={item.tmdb_movie_id}
                  title={item.title || 'Untitled'}
                  rating={0}
                  year={0}
                  posterPath={item.poster_path}
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2 bg-background/80 hover:bg-destructive text-foreground hover:text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  onClick={() => handleRemove(item.id)}
                  title="Remove from watchlist"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Your watchlist is empty</h2>
            <p className="text-muted-foreground mb-8">Add movies to keep track of what you want to watch</p>
            <Link href="/">
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Explore Movies
              </Button>
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
