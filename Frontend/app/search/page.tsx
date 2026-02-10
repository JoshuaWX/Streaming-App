'use client'

import React from "react"

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import MovieCard from '@/components/movie-card'
import Footer from '@/components/footer'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const allMovies = [
  { id: '1', title: 'The Last Horizon', rating: 8.5, year: 2024 },
  { id: '2', title: 'Echoes of Tomorrow', rating: 8.2, year: 2024 },
  { id: '3', title: 'Midnight Chronicles', rating: 7.9, year: 2023 },
  { id: '4', title: 'Beyond the Stars', rating: 8.7, year: 2024 },
  { id: '5', title: 'Lost in Time', rating: 7.6, year: 2023 },
  { id: '6', title: 'Crimson Skies', rating: 8.3, year: 2024 },
  { id: '7', title: 'The Digital Age', rating: 8.1, year: 2024 },
  { id: '8', title: 'Whispers in the Wind', rating: 7.8, year: 2023 },
  { id: '9', title: 'The Final Quest', rating: 8.4, year: 2024 },
  { id: '10', title: 'Neon Dreams', rating: 8.0, year: 2024 },
  { id: '11', title: 'Thunder Heart', rating: 8.6, year: 2024 },
  { id: '12', title: 'Silent Witness', rating: 7.7, year: 2024 },
  { id: '13', title: 'Dark Secrets', rating: 8.2, year: 2024 },
  { id: '14', title: 'Golden Coast', rating: 7.9, year: 2024 },
  { id: '15', title: 'Frozen Fire', rating: 8.5, year: 2024 },
  { id: '16', title: 'The Comeback', rating: 8.1, year: 2024 },
]

type FilterType = 'all' | 'movie' | 'series'
type SortType = 'relevance' | 'rating' | 'year'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState(allMovies)
  const [filter, setFilter] = useState<FilterType>('all')
  const [sort, setSort] = useState<SortType>('relevance')

  useEffect(() => {
    let filtered = allMovies

    // Apply search query
    if (query.trim()) {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(query.toLowerCase())
      )
    }

    // Apply sorting
    const sorted = [...filtered]
    switch (sort) {
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating)
        break
      case 'year':
        sorted.sort((a, b) => b.year - a.year)
        break
      case 'relevance':
      default:
        // Keep original order for relevance
        break
    }

    setResults(sorted)
  }, [query, filter, sort])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Search Section */}
      <div className="bg-card border-b border-border sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="text"
              placeholder="Search movies, shows, actors..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-input border-border text-foreground placeholder:text-muted-foreground"
              autoFocus
            />
            <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              Search
            </Button>
          </form>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {/* Filter and Sort */}
        <div className="flex flex-wrap gap-4 mb-8 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <span className="text-muted-foreground text-sm self-center">Filter:</span>
            {(['all', 'movie', 'series'] as const).map((option) => (
              <Button
                key={option}
                onClick={() => setFilter(option)}
                variant={filter === option ? 'default' : 'outline'}
                className={`text-sm capitalize ${
                  filter === option
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-input border-border text-foreground hover:bg-input/80'
                }`}
              >
                {option}
              </Button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-muted-foreground text-sm self-center">Sort:</span>
            {(['relevance', 'rating', 'year'] as const).map((option) => (
              <Button
                key={option}
                onClick={() => setSort(option)}
                variant={sort === option ? 'default' : 'outline'}
                className={`text-sm capitalize ${
                  sort === option
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-input border-border text-foreground hover:bg-input/80'
                }`}
              >
                {option}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        {query && (
          <p className="text-muted-foreground mb-6">
            Found {results.length} result{results.length !== 1 ? 's' : ''} for{' '}
            <span className="text-foreground font-semibold">"{query}"</span>
          </p>
        )}

        {/* Results Grid */}
        {results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">No results found</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              {query 
                ? `We couldn't find anything matching "${query}". Try a different search.`
                : 'Enter a search term to find movies and TV shows.'}
            </p>
            {query && (
              <Button 
                onClick={() => setQuery('')}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                Clear Search
              </Button>
            )}
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
