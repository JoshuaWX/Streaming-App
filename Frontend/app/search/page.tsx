'use client'

import React from "react"

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import MovieCard from '@/components/movie-card'
import Footer from '@/components/footer'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { searchMovies, type TmdbMovie } from '@/lib/api'
import { extractYear } from '@/lib/tmdb'

type SortType = 'relevance' | 'rating' | 'year'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<TmdbMovie[]>([])
  const [sort, setSort] = useState<SortType>('relevance')
  const [loading, setLoading] = useState(false)
  const [totalResults, setTotalResults] = useState(0)

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([])
      setTotalResults(0)
      return
    }
    setLoading(true)
    try {
      const data = await searchMovies(q)
      setResults(data.results)
      setTotalResults(data.total_results)
    } catch (err) {
      console.error('Search failed:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Search on initial load if query param exists
  useEffect(() => {
    if (initialQuery) {
      doSearch(initialQuery)
    }
  }, [initialQuery, doSearch])

  // Sort results locally
  const sortedResults = [...results].sort((a, b) => {
    switch (sort) {
      case 'rating':
        return b.vote_average - a.vote_average
      case 'year':
        return extractYear(b.release_date) - extractYear(a.release_date)
      case 'relevance':
      default:
        return 0 // keep API order
    }
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    doSearch(query)
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
        {/* Sort Options */}
        <div className="flex flex-wrap gap-4 mb-8 items-center justify-between">
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
        {query && !loading && (
          <p className="text-muted-foreground mb-6">
            Found {totalResults} result{totalResults !== 1 ? 's' : ''} for{' '}
            <span className="text-foreground font-semibold">&ldquo;{query}&rdquo;</span>
          </p>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-pulse text-muted-foreground text-lg">Searching...</div>
          </div>
        )}

        {/* Results Grid */}
        {!loading && sortedResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedResults.map((movie) => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                rating={movie.vote_average}
                year={extractYear(movie.release_date)}
                posterPath={movie.poster_path}
              />
            ))}
          </div>
        ) : !loading && query ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">No results found</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              We couldn&apos;t find anything matching &ldquo;{query}&rdquo;. Try a different search.
            </p>
            <Button 
              onClick={() => { setQuery(''); setResults([]); }}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              Clear Search
            </Button>
          </div>
        ) : !loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">Search for movies</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Enter a search term to find movies and TV shows.
            </p>
          </div>
        ) : null}
      </div>

      <Footer />
    </main>
  )
}
