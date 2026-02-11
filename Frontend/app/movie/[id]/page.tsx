'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import Footer from '@/components/footer'
import HeroSection from '@/components/hero-section'
import MovieCard from '@/components/movie-card'
import { Button } from '@/components/ui/button'
import { fetchMovieDetail, fetchRecommendations, fetchSimilarMovies, fetchDirectorMovies, type TmdbMovieDetail, type TmdbMovie } from '@/lib/api'
import { posterUrl, formatRuntime, maturityRating, extractYear } from '@/lib/tmdb'
import { useAuth } from '@/context/auth-context'

export default function MovieDetailsPage() {
  const params = useParams()
  const tmdbId = Number(params.id)
  const { user } = useAuth()

  const [movie, setMovie] = useState<TmdbMovieDetail | null>(null)
  const [related, setRelated] = useState<TmdbMovie[]>([])
  const [similar, setSimilar] = useState<TmdbMovie[]>([])
  const [directorMovies, setDirectorMovies] = useState<TmdbMovie[]>([])
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
        const [detail, recs, sims, dirMovies] = await Promise.all([
          fetchMovieDetail(tmdbId),
          fetchRecommendations(tmdbId).catch(() => ({ results: [] as TmdbMovie[] })),
          fetchSimilarMovies(tmdbId).catch(() => ({ results: [] as TmdbMovie[] })),
          fetchDirectorMovies(tmdbId).catch(() => [] as TmdbMovie[]),
        ])
        setMovie(detail)
        setRelated(recs.results.slice(0, 8))
        setSimilar(sims.results.slice(0, 8))
        setDirectorMovies(dirMovies)
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
  const cast = movie.credits?.cast?.slice(0, 10) || []
  const trailer = movie.videos?.results?.find(
    (v) => v.type === 'Trailer' && v.site === 'YouTube'
  )
  const heroPoster = posterUrl(movie.poster_path, 'w780') || posterUrl(movie.poster_path, 'w342')
  const smallPoster = posterUrl(movie.poster_path, 'w342') // Use same for now, as alternative posters not easily available

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection featuredMovie={movie} />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {/* Movie Info Section */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          {/* Smaller Poster */}
          <div className="flex-shrink-0">
            <div className="w-38 h-57 bg-card border-2 border-border rounded-lg overflow-hidden shadow-2xl">
              {smallPoster ? (
                <Image
                  src={smallPoster}
                  alt={movie.title}
                  width={152}
                  height={228}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-6xl">
                  🎬
                </div>
              )}
            </div>
          </div>

          {/* Title and Rating */}
          <div className="flex-1">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{movie.title}</h2>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-2xl font-bold text-accent">{movie.vote_average.toFixed(1)}/10</span>
              <div className="w-px h-8 bg-border"></div>
              <div className="flex gap-2 flex-wrap">
                {movie.genres.map((g) => (
                  <span key={g.id} className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm font-medium">{g.name}</span>
                ))}
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed text-lg mb-8">{movie.overview.length > 300 ? movie.overview.substring(0, 300) + '...' : movie.overview}</p>
          </div>
        </div>

        {/* Horizontal Divider */}
        <hr className="border-border my-12" />

        {/* Cast Wheel */}
        <div className="mb-12">
          <div className="flex gap-4 overflow-x-auto pb-4">
            {cast.map((actor) => (
              <Link key={actor.id} href={`/cast/${actor.id}?movieId=${tmdbId}`}>
                <div className="flex-shrink-0 text-center">
                  <div className="w-24 h-24 bg-card border border-border rounded-full overflow-hidden mb-2">
                    {actor.profile_path ? (
                      <Image src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`} alt={actor.name} width={96} height={96} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-2xl">👤</div>
                    )}
                  </div>
                  <p className="text-sm text-foreground font-medium">{actor.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Director and Additional Info */}
        <div className="flex flex-wrap gap-8 mb-12">
          {director && (
            <div className="flex-1 min-w-[200px]">
              <p className="text-muted-foreground text-sm mb-2">Director</p>
              <p className="text-foreground font-semibold text-lg">{director.name}</p>
            </div>
          )}
          <div className="flex-1 min-w-[200px]">
            <p className="text-muted-foreground text-sm mb-2">Status</p>
            <p className="text-foreground font-semibold">{movie.status}</p>
          </div>
          <div className="flex-1 min-w-[200px]">
            <p className="text-muted-foreground text-sm mb-2">Release Year</p>
            <p className="text-foreground font-semibold">{extractYear(movie.release_date)}</p>
          </div>
          <div className="flex-1 min-w-[200px]">
            <p className="text-muted-foreground text-sm mb-2">Duration</p>
            <p className="text-foreground font-semibold">{formatRuntime(movie.runtime)}</p>
          </div>
          <div className="flex-1 min-w-[200px]">
            <p className="text-muted-foreground text-sm mb-2">Rating</p>
            <p className="text-foreground font-semibold">{maturityRating(movie.adult)}</p>
          </div>
          {movie.budget > 0 && (
            <div className="flex-1 min-w-[200px]">
              <p className="text-muted-foreground text-sm mb-2">Budget</p>
              <p className="text-foreground font-semibold">${(movie.budget / 1_000_000).toFixed(0)}M</p>
            </div>
          )}
          {movie.revenue > 0 && (
            <div className="flex-1 min-w-[200px]">
              <p className="text-muted-foreground text-sm mb-2">Revenue</p>
              <p className="text-foreground font-semibold">${(movie.revenue / 1_000_000).toFixed(0)}M</p>
            </div>
          )}
          <div className="flex-1 min-w-[200px]">
            <p className="text-muted-foreground text-sm mb-2">Language</p>
            <p className="text-foreground font-semibold">{movie.original_language?.toUpperCase()}</p>
          </div>
        </div>

        {/* Synopsis */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-6">Synopsis</h2>
          <p className="text-muted-foreground leading-relaxed text-lg mb-4">{movie.overview}</p>
          {movie.production_companies && movie.production_companies.length > 0 && (
            <div className="mb-4">
              <p className="text-muted-foreground text-sm mb-2">Production Companies</p>
              <p className="text-foreground font-semibold">{movie.production_companies.map(c => c.name).join(', ')}</p>
            </div>
          )}
          {movie.production_countries && movie.production_countries.length > 0 && (
            <div className="mb-4">
              <p className="text-muted-foreground text-sm mb-2">Production Countries</p>
              <p className="text-foreground font-semibold">{movie.production_countries.map(c => c.name).join(', ')}</p>
            </div>
          )}
          {movie.spoken_languages && movie.spoken_languages.length > 0 && (
            <div className="mb-4">
              <p className="text-muted-foreground text-sm mb-2">Spoken Languages</p>
              <p className="text-foreground font-semibold">{movie.spoken_languages.map(l => l.english_name).join(', ')}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 flex-wrap mb-12">
          {trailer ? (
            <a
              href={`https://www.youtube.com/watch?v=${trailer.key}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[200px]"
            >
              <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-3 text-lg">
                ▶ Play Trailer
              </Button>
            </a>
          ) : (
            <Link href={`/play?id=${movie.id}`} className="flex-1 min-w-[200px]">
              <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-3 text-lg">
                Play
              </Button>
            </Link>
          )}
          <Button
            onClick={() => setAddedToList(!addedToList)}
            variant="outline"
            className={`flex-1 min-w-[200px] py-3 text-lg ${
              addedToList
                ? 'bg-accent text-accent-foreground border-accent'
                : 'bg-input border-border text-foreground hover:bg-input/80'
            }`}
          >
            {addedToList ? '✓ Added to Watchlist' : '+ Add to Watchlist'}
          </Button>
        </div>

        {/* Related Movies */}
        {similar.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Related Movies</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {similar.map((m) => (
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

        {/* Recommended Content */}
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

        {/* Director Movies */}
        {directorMovies.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">More from {director?.name}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {directorMovies.map((m) => (
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
