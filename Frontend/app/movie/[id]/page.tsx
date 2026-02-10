'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import Footer from '@/components/footer'
import MovieCard from '@/components/movie-card'
import { Button } from '@/components/ui/button'
import { fetchMovieDetail, fetchRecommendations, type TmdbMovieDetail, type TmdbMovie } from '@/lib/api'
import { backdropUrl, posterUrl, formatRuntime, maturityRating, extractYear } from '@/lib/tmdb'
import { useAuth } from '@/context/auth-context'

export default function MovieDetailsPage() {
  const params = useParams()
  const tmdbId = Number(params.id)
  const { user } = useAuth()

  const [movie, setMovie] = useState<TmdbMovieDetail | null>(null)
  const [related, setRelated] = useState<TmdbMovie[]>([])
  const [loading, setLoading] = useState(true)
  const [addedToList, setAddedToList] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)

  useEffect(() => {
    if (!tmdbId || isNaN(tmdbId)) {
      setLoading(false)
      return
    }

    async function loadMovie() {
      try {
        const [detail, recs] = await Promise.all([
          fetchMovieDetail(tmdbId),
          fetchRecommendations(tmdbId).catch(() => ({ results: [] as TmdbMovie[] })),
        ])
        setMovie(detail)
        setRelated(recs.results.slice(0, 8))
      } catch (err) {
        console.error('Failed to load movie:', err)
      } finally {
        setLoading(false)
      }
    }
    loadMovie()
  }, [tmdbId])

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground text-lg">Loading movie...</div>
      </main>
    )
  }

  if (!movie) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Movie Not Found</h1>
          <p className="text-muted-foreground mb-8">The movie you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/">
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
              Back to Home
            </Button>
          </Link>
        </div>
      </main>
    )
  }

  const director = movie.credits?.crew?.find((c) => c.job === 'Director')
  const cast = movie.credits?.cast?.slice(0, 6) || []
  const trailer = movie.videos?.results?.find(
    (v) => v.type === 'Trailer' && v.site === 'YouTube'
  )
  const bgImage = backdropUrl(movie.backdrop_path)
  const poster = posterUrl(movie.poster_path, 'w342')

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Background */}
      <div className="relative h-96">
        {bgImage ? (
          <Image src={bgImage} alt={movie.title} fill className="object-cover" priority />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-card to-background" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Main Info Section */}
        <div className="relative -mt-40 mb-12 z-10">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <div className="flex-shrink-0">
              <div className="w-40 md:w-48 aspect-[2/3] bg-card border-2 border-border rounded-lg overflow-hidden shadow-2xl">
                {poster ? (
                  <Image
                    src={poster}
                    alt={movie.title}
                    width={192}
                    height={288}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-6xl">
                    🎬
                  </div>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="flex-1">
              <div className="mb-4">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                      {movie.title}
                    </h1>
                    {movie.tagline && (
                      <p className="text-muted-foreground italic mb-3">&ldquo;{movie.tagline}&rdquo;</p>
                    )}
                    <div className="flex flex-wrap gap-3 items-center">
                      <span className="inline-block bg-accent/20 text-accent px-3 py-1 rounded-full text-sm font-semibold">
                        {movie.vote_average.toFixed(1)}/10
                      </span>
                      <span className="text-muted-foreground">{extractYear(movie.release_date)}</span>
                      <span className="text-muted-foreground">{formatRuntime(movie.runtime)}</span>
                      <span className="inline-block border border-muted px-2 py-1 rounded text-xs text-muted-foreground">
                        {maturityRating(movie.adult)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsFavorited(!isFavorited)}
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
                {director && (
                  <div>
                    <p className="text-muted-foreground text-sm">Director</p>
                    <p className="text-foreground font-semibold">{director.name}</p>
                  </div>
                )}
                {cast.length > 0 && (
                  <div>
                    <p className="text-muted-foreground text-sm">Cast</p>
                    <p className="text-foreground">{cast.map((c) => c.name).join(', ')}</p>
                  </div>
                )}
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres.map((g) => (
                  <Link
                    key={g.id}
                    href={`/search?q=${g.name}`}
                    className="inline-block bg-input hover:bg-input/80 text-foreground px-3 py-1 rounded-full text-sm transition-colors"
                  >
                    {g.name}
                  </Link>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 flex-wrap">
                {trailer ? (
                  <a
                    href={`https://www.youtube.com/watch?v=${trailer.key}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-[200px]"
                  >
                    <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                      ▶ Watch Trailer
                    </Button>
                  </a>
                ) : (
                  <Link href={`/play?id=${movie.id}`} className="flex-1 min-w-[200px]">
                    <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                      Play
                    </Button>
                  </Link>
                )}
                <Button
                  onClick={() => setAddedToList(!addedToList)}
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
            <p className="text-muted-foreground leading-relaxed mb-6">{movie.overview}</p>
          </div>

          {/* Additional Info */}
          <div className="bg-card border border-border rounded-lg p-6 h-fit">
            <h3 className="text-lg font-bold text-foreground mb-4">Info</h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-muted-foreground">Status</p>
                <p className="text-foreground font-semibold">{movie.status}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Release Year</p>
                <p className="text-foreground font-semibold">{extractYear(movie.release_date)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Duration</p>
                <p className="text-foreground font-semibold">{formatRuntime(movie.runtime)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Rating</p>
                <p className="text-foreground font-semibold">{maturityRating(movie.adult)}</p>
              </div>
              {movie.budget > 0 && (
                <div>
                  <p className="text-muted-foreground">Budget</p>
                  <p className="text-foreground font-semibold">${(movie.budget / 1_000_000).toFixed(0)}M</p>
                </div>
              )}
              {movie.revenue > 0 && (
                <div>
                  <p className="text-muted-foreground">Revenue</p>
                  <p className="text-foreground font-semibold">${(movie.revenue / 1_000_000).toFixed(0)}M</p>
                </div>
              )}
              <div>
                <p className="text-muted-foreground">Language</p>
                <p className="text-foreground font-semibold">{movie.original_language?.toUpperCase()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Content */}
        {related.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Recommended</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {related.map((m) => (
                <MovieCard
                  key={m.id}
                  id={m.id}
                  title={m.title}
                  rating={m.vote_average}
                  year={extractYear(m.release_date)}
                  posterPath={m.poster_path}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
