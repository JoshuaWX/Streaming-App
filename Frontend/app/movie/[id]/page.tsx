'use client'

import { useState } from 'react'
import Link from 'next/link'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import { getMovie, getAllMovies } from '@/lib/movies'

interface MovieDetailsPageProps {
  params: {
    id: string
  }
}

export default function MovieDetailsPage({ params }: MovieDetailsPageProps) {
  const [addedToList, setAddedToList] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const movieDetails = getMovie(params.id)

  if (!movieDetails) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Movie Not Found</h1>
          <p className="text-muted-foreground mb-8">The movie you're looking for doesn't exist.</p>
          <Link href="/">
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
              Back to Home
            </Button>
          </Link>
        </div>
      </main>
    )
  }

  const handleAddToList = () => {
    setAddedToList(!addedToList)
  }

  const handleFavorite = () => {
    setIsFavorited(!isFavorited)
  }

  const relatedMovies = getAllMovies()
    .filter((m) => m.id !== movieDetails.id && m.genre.some((g) => movieDetails.genre.includes(g)))
    .slice(0, 4)

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Background */}
      <div className={`relative bg-gradient-to-b from-card to-background h-96 border-b border-border bg-gradient-to-br ${movieDetails.posterColor}`}>
        <div className="absolute inset-0 opacity-30 bg-gradient-to-r from-background via-transparent to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Main Info Section */}
        <div className="relative -mt-40 mb-12 z-10">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <div className="flex-shrink-0">
              <div className="w-40 md:w-48 aspect-video bg-card border-2 border-border rounded-lg overflow-hidden shadow-2xl">
                <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-6xl">
                  🎬
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="flex-1">
              <div className="mb-4">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                      {movieDetails.title}
                    </h1>
                    <div className="flex flex-wrap gap-3 items-center">
                      <span className="inline-block bg-accent/20 text-accent px-3 py-1 rounded-full text-sm font-semibold">
                        {movieDetails.rating}/10
                      </span>
                      <span className="text-muted-foreground">{movieDetails.year}</span>
                      <span className="text-muted-foreground">{movieDetails.duration}</span>
                      <span className="inline-block border border-muted px-2 py-1 rounded text-xs text-muted-foreground">
                        {movieDetails.maturityRating}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleFavorite}
                    className={`p-3 rounded-full transition-colors ${
                      isFavorited
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-input text-foreground hover:bg-input/80'
                    }`}
                  >
                    <svg className="w-6 h-6" fill={isFavorited ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Director & Cast */}
              <div className="space-y-3 mb-6">
                <div>
                  <p className="text-muted-foreground text-sm">Director</p>
                  <p className="text-foreground font-semibold">{movieDetails.director}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Cast</p>
                  <p className="text-foreground">{movieDetails.cast.join(', ')}</p>
                </div>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-6">
                {movieDetails.genre.map((g) => (
                  <Link
                    key={g}
                    href={`/search?q=${g}`}
                    className="inline-block bg-input hover:bg-input/80 text-foreground px-3 py-1 rounded-full text-sm transition-colors"
                  >
                    {g}
                  </Link>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 flex-wrap">
                <Link href="/play" className="flex-1 min-w-[200px]">
                  <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                    Play
                  </Button>
                </Link>
                <Button
                  onClick={handleAddToList}
                  variant="outline"
                  className={`flex-1 min-w-[200px] ${
                    addedToList
                      ? 'bg-accent text-accent-foreground border-accent'
                      : 'bg-input border-border text-foreground hover:bg-input/80'
                  }`}
                >
                  {addedToList ? '✓ In List' : '+ Add to List'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-foreground mb-4">Overview</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">{movieDetails.description}</p>
            
            <h3 className="text-xl font-bold text-foreground mb-3">Full Plot</h3>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {movieDetails.fullPlot}
            </p>
          </div>

          {/* Additional Info */}
          <div className="bg-card border border-border rounded-lg p-6 h-fit">
            <h3 className="text-lg font-bold text-foreground mb-4">Info</h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-muted-foreground">Type</p>
                <p className="text-foreground font-semibold">Movie</p>
              </div>
              <div>
                <p className="text-muted-foreground">Release Year</p>
                <p className="text-foreground font-semibold">{movieDetails.year}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Duration</p>
                <p className="text-foreground font-semibold">{movieDetails.duration}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Rating</p>
                <p className="text-foreground font-semibold">{movieDetails.maturityRating}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Content */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Related Movies</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedMovies.length > 0 ? (
              relatedMovies.map((movie) => (
                <Link key={movie.id} href={`/movie/${movie.id}`}>
                  <div className={`aspect-video bg-gradient-to-br ${movie.posterColor} rounded-lg hover:ring-2 ring-accent transition-all cursor-pointer flex flex-col items-center justify-center text-4xl p-4`}>
                    <div className="text-5xl mb-2">🎬</div>
                    <p className="text-sm font-bold text-center text-white/90 truncate">{movie.title}</p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                No related movies found
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
