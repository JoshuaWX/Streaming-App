'use client'

import { useState } from 'react'
import Link from 'next/link'
import MovieCard from '@/components/movie-card'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import { useFavourites } from '@/context/favourites-context'

type SortOption = 'recently-added' | 'title'

export default function FavouritesPage() {
  const { user, loading: authLoading } = useAuth()
  const { favourites, loading, remove } = useFavourites()
  const [sortBy, setSortBy] = useState<SortOption>('recently-added')

  const sortedFavourites = [...favourites].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return (a.title || '').localeCompare(b.title || '')
      case 'recently-added':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }
  })

  const handleRemove = async (tmdbId: number) => {
    try {
      await remove(tmdbId)
    } catch (err) {
      console.error('Failed to remove favourite:', err)
    }
  }

  if (!authLoading && !user) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Sign in to see your favourites</h2>
          <p className="text-muted-foreground mb-8">Create an account or sign in to save movies.</p>
          <Link href="/login">
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">Sign In</Button>
          </Link>
        </div>
      </main>
    )
  }

  if (authLoading || loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground text-lg">Loading favourites...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-card to-background py-16 px-4 md:px-8 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-accent-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">Favourites</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            {favourites.length} {favourites.length === 1 ? 'movie' : 'movies'} saved
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {sortedFavourites.length > 0 ? (
          <>
            {/* Sort Options */}
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="text-muted-foreground text-sm self-center">Sort by:</span>
              {(['recently-added', 'title'] as const).map((option) => (
                <Button
                  key={option}
                  onClick={() => setSortBy(option)}
                  variant={sortBy === option ? 'default' : 'outline'}
                  size="sm"
                  className={
                    sortBy === option
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-input border-border text-foreground hover:bg-input/80'
                  }
                >
                  {option === 'recently-added' ? 'Recently Added' : 'Title'}
                </Button>
              ))}
            </div>

            {/* Movies Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {sortedFavourites.map((fav) => (
                <div key={fav.id} className="relative group">
                  <MovieCard
                    id={fav.tmdb_id}
                    title={fav.title || 'Untitled'}
                    rating={0}
                    year={0}
                    posterPath={fav.poster_path}
                  />
                  <button
                    onClick={() => handleRemove(fav.tmdb_id)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 hover:bg-red-700 text-white rounded-full p-2 z-10"
                    aria-label="Remove from favourites"
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
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">No favourites yet</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Start adding movies to your favourites by clicking the heart icon on any movie card.
            </p>
            <Link href="/">
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Browse Movies
              </Button>
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
