'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import Footer from '@/components/footer'
import MovieCard from '@/components/movie-card'
import { Button } from '@/components/ui/button'
import { fetchCastDetail, fetchCastMovies, type TmdbCastDetail, type TmdbMovie } from '@/lib/api'
import { extractYear } from '@/lib/tmdb'

export default function CastDetailsPage() {
  const params = useParams()
  const castId = Number(params.id)
  const movieId = params.movieId ? Number(params.movieId) : null

  const [cast, setCast] = useState<TmdbCastDetail | null>(null)
  const [movies, setMovies] = useState<TmdbMovie[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!castId || isNaN(castId)) {
      setLoading(false)
      return
    }

    async function loadCast() {
      try {
        const [detail, castMovies] = await Promise.all([
          fetchCastDetail(castId),
          fetchCastMovies(castId).catch(() => ({ cast: [] as TmdbMovie[] })),
        ])
        setCast(detail)
        setMovies(castMovies.cast.slice(0, 20))
      } catch (err) {
        console.error('Failed to load cast:', err)
      } finally {
        setLoading(false)
      }
    }
    loadCast()
  }, [castId])

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground text-lg">Loading cast...</div>
      </main>
    )
  }

  if (!cast) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Cast Member Not Found</h1>
          <p className="text-muted-foreground mb-8">The cast member you&apos;re looking for doesn&apos;t exist.</p>
          <Link href={movieId ? `/movie/${movieId}` : "/"}>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
              {movieId ? "Back to Movie" : "Back to Home"}
            </Button>
          </Link>
        </div>
      </main>
    )
  }

  const profileImage = cast.profile_path ? `https://image.tmdb.org/t/p/w500${cast.profile_path}` : null

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-96 flex items-center justify-center bg-gradient-to-br from-card to-background">
        <div className="text-center text-foreground max-w-4xl px-4">
          <div className="flex justify-center mb-6">
            {profileImage ? (
              <Image
                src={profileImage}
                alt={cast.name}
                width={200}
                height={300}
                className="rounded-lg shadow-2xl object-cover"
              />
            ) : (
              <div className="w-48 h-72 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-6xl shadow-2xl">
                👤
              </div>
            )}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{cast.name}</h1>
          {cast.known_for_department && (
            <p className="text-xl md:text-2xl text-muted-foreground">{cast.known_for_department}</p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {/* Biography */}
        {cast.biography && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-6">Biography</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">{cast.biography}</p>
          </div>
        )}

        {/* Personal Info */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="space-y-4">
            {cast.birthday && (
              <div>
                <p className="text-muted-foreground text-sm mb-2">Birthday</p>
                <p className="text-foreground font-semibold">{new Date(cast.birthday).toLocaleDateString()}</p>
              </div>
            )}
            {cast.place_of_birth && (
              <div>
                <p className="text-muted-foreground text-sm mb-2">Place of Birth</p>
                <p className="text-foreground font-semibold">{cast.place_of_birth}</p>
              </div>
            )}
            {cast.deathday && (
              <div>
                <p className="text-muted-foreground text-sm mb-2">Deathday</p>
                <p className="text-foreground font-semibold">{new Date(cast.deathday).toLocaleDateString()}</p>
              </div>
            )}
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-muted-foreground text-sm mb-2">Gender</p>
              <p className="text-foreground font-semibold">
                {cast.gender === 1 ? 'Female' : cast.gender === 2 ? 'Male' : 'Other'}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm mb-2">Popularity</p>
              <p className="text-foreground font-semibold">{cast.popularity.toFixed(1)}</p>
            </div>
          </div>
        </div>

        {/* Known For Movies */}
        {movies.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-6">Known For</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {movies.map((movie) => (
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
          </div>
        )}

        {/* Back Button */}
        <div className="flex justify-center">
          <Link href="/">
            <Button variant="outline" className="px-8 py-3 text-lg">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  )
}
