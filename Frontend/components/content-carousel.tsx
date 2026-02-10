'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import MovieCard from './movie-card'
import { useState, useRef } from 'react'

interface ContentCarouselProps {
  title: string
  movies: Array<{
    id: string
    title: string
    rating: number
    year: number
  }>
}

export default function ContentCarousel({ title, movies }: ContentCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return

    const scrollAmount = 300
    const newScrollPosition =
      scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount)

    scrollContainerRef.current.scrollTo({
      left: newScrollPosition,
      behavior: 'smooth',
    })

    // Update button states
    setTimeout(() => {
      if (scrollContainerRef.current) {
        setCanScrollLeft(scrollContainerRef.current.scrollLeft > 0)
        setCanScrollRight(
          scrollContainerRef.current.scrollLeft <
            scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth - 10
        )
      }
    }, 100)
  }

  return (
    <section className="py-8 md:py-12 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="border-muted-foreground text-foreground hover:bg-muted/20 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="border-muted-foreground text-foreground hover:bg-muted/20 disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Movies Grid */}
      <div
        ref={scrollContainerRef}
        className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollBehavior: 'smooth' }}
      >
        {movies.map((movie) => (
          <div key={movie.id} className="flex-shrink-0 w-[150px] md:w-[200px] lg:w-[220px]">
            <MovieCard id={movie.id} title={movie.title} rating={movie.rating} year={movie.year} />
          </div>
        ))}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  )
}
