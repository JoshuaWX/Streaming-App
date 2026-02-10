'use client'

import Link from 'next/link'
import { Play, Plus, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface MovieCardProps {
  id?: string
  title: string
  rating: number
  year: number
  imageUrl?: string
  movie?: {
    id: string
    title: string
    rating: number
    year: number
  }
}

export default function MovieCard({ id, title, rating, year, imageUrl, movie }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const movieId = movie?.id || id
  const movieTitle = movie?.title || title
  const movieRating = movie?.rating || rating
  const movieYear = movie?.year || year

  return (
    <Link href={`/movie/${movieId}`}>
      <div
        className="group relative rounded-lg overflow-hidden aspect-[2/3] cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Placeholder Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-card to-muted" />

        {/* Card Content */}
        <div className="relative h-full flex flex-col justify-end p-4 bg-gradient-to-t from-background via-transparent to-transparent">
          <div className="space-y-2">
            <h3 className="text-sm md:text-base font-bold text-foreground line-clamp-2">{movieTitle}</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-accent text-accent" />
                <span className="text-xs md:text-sm text-muted-foreground">{movieRating}</span>
              </div>
              <span className="text-xs text-muted-foreground">{movieYear}</span>
            </div>
          </div>
        </div>

        {/* Hover Overlay */}
        {isHovered && (
          <div className="absolute inset-0 bg-background/95 flex items-center justify-center gap-3" onClick={(e) => e.preventDefault()}>
            <Link href="/play" onClick={(e) => e.stopPropagation()}>
              <Button size="icon" className="rounded-full bg-accent hover:bg-accent/90 text-accent-foreground w-12 h-12">
                <Play className="w-5 h-5" />
              </Button>
            </Link>
            <Button
              size="icon"
              variant="outline"
              className="rounded-full border-muted-foreground text-foreground hover:bg-muted/20 w-12 h-12 bg-transparent"
              onClick={(e) => e.stopPropagation()}
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </Link>
  )
}
