'use client'

import { useState } from 'react'
import Link from 'next/link'
import MovieCard from '@/components/movie-card'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Clock, Trash2 } from 'lucide-react'

const watchlistItems = [
  { id: '1', title: 'The Last Horizon', rating: 8.5, year: 2024, addedDate: '2024-02-01' },
  { id: '2', title: 'Echoes of Tomorrow', rating: 8.2, year: 2024, addedDate: '2024-01-28' },
  { id: '4', title: 'Beyond the Stars', rating: 8.7, year: 2024, addedDate: '2024-01-25' },
  { id: '5', title: 'Lost in Time', rating: 7.6, year: 2023, addedDate: '2024-01-20' },
  { id: '6', title: 'Crimson Skies', rating: 8.3, year: 2024, addedDate: '2024-01-15' },
  { id: '8', title: 'Whispers in the Wind', rating: 7.8, year: 2023, addedDate: '2024-01-10' },
]

export default function WatchlistPage() {
  const [items, setItems] = useState(watchlistItems)
  const [sortBy, setSortBy] = useState<'added' | 'rating' | 'title' | 'year'>('added')

  const handleRemove = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const sortedItems = [...items].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating
      case 'title':
        return a.title.localeCompare(b.title)
      case 'year':
        return b.year - a.year
      case 'added':
      default:
        return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()
    }
  })

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
              {(['added', 'rating', 'title', 'year'] as const).map((option) => (
                <Button
                  key={option}
                  variant={sortBy === option ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy(option)}
                  className={sortBy === option ? 'bg-accent hover:bg-accent/90 text-accent-foreground' : ''}
                >
                  {option === 'added' ? 'Recently Added' : option.charAt(0).toUpperCase() + option.slice(1)}
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
                  id={item.id}
                  title={item.title}
                  rating={item.rating}
                  year={item.year}
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
