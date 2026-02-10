'use client'

import { useState } from 'react'
import MovieCard from '@/components/movie-card'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'

const watchlistMovies = [
  { id: '1', title: 'The Last Horizon', rating: 8.5, year: 2024 },
  { id: '2', title: 'Echoes of Tomorrow', rating: 8.2, year: 2024 },
  { id: '3', title: 'Midnight Chronicles', rating: 7.9, year: 2023 },
  { id: '4', title: 'Beyond the Stars', rating: 8.7, year: 2024 },
  { id: '5', title: 'Lost in Time', rating: 7.6, year: 2023 },
  { id: '6', title: 'Crimson Skies', rating: 8.3, year: 2024 },
  { id: '7', title: 'The Digital Age', rating: 8.1, year: 2024 },
  { id: '8', title: 'Whispers in the Wind', rating: 7.8, year: 2023 },
]

type SortOption = 'recently-added' | 'rating' | 'title' | 'year'

export default function MyListPage() {
  const [sortBy, setSortBy] = useState<SortOption>('recently-added')
  const [items, setItems] = useState(watchlistMovies)

  const handleSort = (option: SortOption) => {
    setSortBy(option)
    let sorted = [...items]

    switch (option) {
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating)
        break
      case 'title':
        sorted.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'year':
        sorted.sort((a, b) => b.year - a.year)
        break
      case 'recently-added':
      default:
        sorted = watchlistMovies
    }

    setItems(sorted)
  }

  const handleRemove = (id: string) => {
    setItems(items.filter(item => item.id !== id))
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
        {items.length > 0 ? (
          <>
            {/* Sort Options */}
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="text-muted-foreground text-sm self-center">Sort by:</span>
              {(['recently-added', 'rating', 'title', 'year'] as const).map((option) => (
                <Button
                  key={option}
                  onClick={() => handleSort(option)}
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
              {items.map((movie) => (
                <div key={movie.id} className="relative group">
                  <MovieCard movie={movie} />
                  <button
                    onClick={() => handleRemove(movie.id)}
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
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
              Browse Content
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
