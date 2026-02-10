'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Play, Heart, Star, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { posterUrl, gradientForId, extractYear } from '@/lib/tmdb'
import { useFavourites } from '@/context/favourites-context'
import { useAuth } from '@/context/auth-context'
import { useToast } from '@/hooks/use-toast'

interface MovieCardProps {
  /** TMDB numeric id or legacy string id */
  id?: string | number
  title: string
  rating: number
  year: number
  /** TMDB poster_path */
  posterPath?: string | null
  imageUrl?: string
  movie?: {
    id: string | number
    title: string
    rating: number
    year: number
    poster_path?: string | null
    vote_average?: number
    release_date?: string
  }
}

export default function MovieCard({ id, title, rating, year, posterPath, imageUrl, movie }: MovieCardProps) {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const { isFavourited, add, remove } = useFavourites()
  const [isHovered, setIsHovered] = useState(false)
  const [favLoading, setFavLoading] = useState(false)
  const movieId = movie?.id || id
  const movieTitle = movie?.title || title
  const movieRating = movie?.vote_average || movie?.rating || rating
  const movieYear = movie?.release_date ? extractYear(movie.release_date) : (movie?.year || year)
  const imgPath = movie?.poster_path || posterPath
  const imgSrc = posterUrl(imgPath ?? null, 'w342') || imageUrl

  const numericId = typeof movieId === 'number' ? movieId : parseInt(String(movieId), 10) || 0
  const favourited = isFavourited(numericId)

  const toggleFavourite = async (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (!user) {
      toast({ title: 'Sign in required', description: 'Please sign in to add favourites.', variant: 'destructive' })
      return
    }
    if (favLoading) return
    setFavLoading(true)
    try {
      if (favourited) {
        await remove(numericId)
      } else {
        await add(numericId, movieTitle, imgPath ?? undefined)
      }
    } catch (err) {
      console.error('Favourite toggle failed:', err)
    } finally {
      setFavLoading(false)
    }
  }

  return (
    <div
      className="group relative rounded-lg overflow-hidden aspect-[2/3] cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => router.push(`/movie/${movieId}`)}
      role="link"
    >
      {/* Poster image or gradient placeholder */}
      {imgSrc ? (
        <Image
          src={imgSrc}
          alt={movieTitle}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${gradientForId(numericId)}`} />
      )}

      {/* Card Content */}
      <div className="relative h-full flex flex-col justify-end p-4 bg-gradient-to-t from-background via-transparent to-transparent">
        <div className="space-y-2">
          <h3 className="text-sm md:text-base font-bold text-foreground line-clamp-2">{movieTitle}</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-accent text-accent" />
              <span className="text-xs md:text-sm text-muted-foreground">{movieRating?.toFixed(1)}</span>
            </div>
            <span className="text-xs text-muted-foreground">{movieYear || ''}</span>
          </div>
        </div>
      </div>

      {/* Hover Overlay */}
      {isHovered && (
        <div
          className="absolute inset-0 bg-background/95 flex items-center justify-center gap-3"
          onClick={(e) => {
            e.stopPropagation()
            router.push(`/movie/${movieId}`)
          }}
        >
          <Button
            size="icon"
            className="rounded-full bg-accent hover:bg-accent/90 text-accent-foreground w-12 h-12"
            onClick={(e) => { e.stopPropagation(); router.push(`/play?id=${movieId}`); }}
          >
            <Play className="w-5 h-5" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className={`rounded-full w-12 h-12 ${
              favourited
                ? 'bg-accent border-accent text-accent-foreground hover:bg-accent/90'
                : 'border-muted-foreground text-foreground hover:bg-muted/20 bg-transparent'
            }`}
            onClick={toggleFavourite}
            disabled={favLoading}
          >
            {favLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Heart className={`w-5 h-5 ${favourited ? 'fill-current' : ''}`} />
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
