'use client'

import { useState } from 'react'
import Link from 'next/link'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Newspaper, Calendar, ArrowRight } from 'lucide-react'

const newsArticles = [
  {
    id: '1',
    title: 'The Last Horizon Breaks Box Office Records on Opening Weekend',
    excerpt: 'The highly anticipated sci-fi epic achieves unprecedented success, becoming the highest-grossing opening weekend ever.',
    date: '2024-02-08',
    category: 'Box Office',
    image: '🎬',
  },
  {
    id: '2',
    title: 'Director Christopher Nolan Announces New Project for 2025',
    excerpt: 'After the massive success of The Last Horizon, the acclaimed director reveals plans for his next groundbreaking film.',
    date: '2024-02-06',
    category: 'Industry',
    image: '📽️',
  },
  {
    id: '3',
    title: 'FlixStream Reaches 50 Million Subscribers Milestone',
    excerpt: 'The streaming platform celebrates a massive achievement in user base growth, expanding its market presence globally.',
    date: '2024-02-05',
    category: 'Platform News',
    image: '📊',
  },
  {
    id: '4',
    title: 'New Academy Award Nominations Announced',
    excerpt: 'The latest Oscar nominations feature groundbreaking films that push the boundaries of cinema.',
    date: '2024-02-03',
    category: 'Awards',
    image: '🏆',
  },
  {
    id: '5',
    title: 'Streaming Wars Heat Up with Exclusive Content Deals',
    excerpt: 'Major platforms compete for exclusive content rights, offering unprecedented budgets for original productions.',
    date: '2024-02-01',
    category: 'Industry',
    image: '💼',
  },
  {
    id: '6',
    title: 'The Best Movies You Missed Last Year',
    excerpt: 'A comprehensive list of critically acclaimed films that deserve your attention from 2023.',
    date: '2024-01-30',
    category: 'Reviews',
    image: '⭐',
  },
  {
    id: '7',
    title: 'Behind the Scenes: Creating Visual Effects for Modern Cinema',
    excerpt: 'Explore the innovative techniques used to create stunning visual effects in blockbuster productions.',
    date: '2024-01-28',
    category: 'Technology',
    image: '🎨',
  },
  {
    id: '8',
    title: 'International Films Gain Momentum in Global Markets',
    excerpt: 'Subtitled and dubbed content from around the world is gaining unprecedented popularity among streaming audiences.',
    date: '2024-01-25',
    category: 'Industry',
    image: '🌍',
  },
]

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = Array.from(new Set(newsArticles.map((article) => article.category)))

  const filteredArticles = selectedCategory
    ? newsArticles.filter((article) => article.category === selectedCategory)
    : newsArticles

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-card to-background py-12 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                <Newspaper className="w-6 h-6 text-accent-foreground" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">News & Updates</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Stay updated with the latest entertainment news and industry insights
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        {/* Category Filter */}
        <div className="mb-12">
          <h2 className="text-sm font-semibold text-muted-foreground mb-4 uppercase">Filter by category</h2>
          <div className="flex flex-wrap gap-3">
            <Button
              variant={selectedCategory === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className={selectedCategory === null ? 'bg-accent hover:bg-accent/90 text-accent-foreground' : ''}
            >
              All News
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? 'bg-accent hover:bg-accent/90 text-accent-foreground' : ''}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* News Grid */}
        <div className="space-y-6">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              className="group bg-card border border-border rounded-lg overflow-hidden hover:border-accent transition-colors"
            >
              <div className="flex flex-col md:flex-row">
                {/* Image */}
                <div className="md:w-48 h-48 md:h-auto bg-gradient-to-br from-card to-muted flex items-center justify-center text-6xl">
                  {article.image}
                </div>

                {/* Content */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-muted rounded-full text-xs font-semibold text-muted-foreground">
                        {article.category}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {new Date(article.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-accent transition-colors line-clamp-2">
                      {article.title}
                    </h3>

                    <p className="text-muted-foreground line-clamp-3">{article.excerpt}</p>
                  </div>

                  {/* Read More Button */}
                  <div className="mt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-accent hover:text-accent hover:bg-accent/10 p-0 h-auto"
                    >
                      Read more
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-16">
            <Newspaper className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-bold text-foreground mb-2">No articles found</h2>
            <p className="text-muted-foreground mb-8">Try a different category or check back later for more news.</p>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
