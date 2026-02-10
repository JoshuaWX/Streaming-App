'use client'

import { useEffect, useState } from 'react'
import HeroSection from '@/components/hero-section'
import ContentCarousel from '@/components/content-carousel'
import Footer from '@/components/footer'
import { fetchTrending, fetchPopular, fetchTopRated, type TmdbMovie } from '@/lib/api'

export default function Page() {
  const [trending, setTrending] = useState<TmdbMovie[]>([])
  const [popular, setPopular] = useState<TmdbMovie[]>([])
  const [topRated, setTopRated] = useState<TmdbMovie[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [trendingRes, popularRes, topRatedRes] = await Promise.all([
          fetchTrending('day'),
          fetchPopular(),
          fetchTopRated(),
        ])
        setTrending(trendingRes.results.slice(0, 10))
        setPopular(popularRes.results.slice(0, 10))
        setTopRated(topRatedRes.results.slice(0, 10))
      } catch (err) {
        console.error('Failed to load home data:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Map TMDB movies to carousel format
  const toCarousel = (movies: TmdbMovie[]) =>
    movies.map((m) => ({
      id: m.id,
      title: m.title,
      vote_average: m.vote_average,
      release_date: m.release_date,
      poster_path: m.poster_path,
    }))

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground text-lg">Loading...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <HeroSection featuredMovie={trending[0] || null} />
      <ContentCarousel title="Trending Now" movies={toCarousel(trending)} />
      <ContentCarousel title="Popular" movies={toCarousel(popular)} />
      <ContentCarousel title="Top Rated" movies={toCarousel(topRated)} />
      <Footer />
    </main>
  )
}
