'use client'

import { useState, useEffect } from 'react'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Newspaper, Calendar, ArrowRight } from 'lucide-react'
import { fetchNews, type NewsArticleApi } from '@/lib/api'

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticleApi[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadNews() {
      try {
        const data = await fetchNews()
        setArticles(data.articles || [])
      } catch (err) {
        console.error('Failed to load news:', err)
      } finally {
        setLoading(false)
      }
    }
    loadNews()
  }, [])

  // Derive unique sources as categories
  const categories = Array.from(new Set(articles.map((a) => a.source)))
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredArticles = selectedCategory
    ? articles.filter((a) => a.source === selectedCategory)
    : articles

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground text-lg">Loading news...</div>
      </main>
    )
  }

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
        {categories.length > 0 && (
          <div className="mb-12">
            <h2 className="text-sm font-semibold text-muted-foreground mb-4 uppercase">Filter by source</h2>
            <div className="flex flex-wrap gap-3">
              <Button
                variant={selectedCategory === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className={selectedCategory === null ? 'bg-accent hover:bg-accent/90 text-accent-foreground' : ''}
              >
                All News
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  className={selectedCategory === cat ? 'bg-accent hover:bg-accent/90 text-accent-foreground' : ''}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* News Grid */}
        <div className="space-y-6">
          {filteredArticles.map((article, i) => (
            <a
              key={i}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-accent transition-colors">
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="md:w-48 h-48 md:h-auto bg-gradient-to-br from-card to-muted flex items-center justify-center overflow-hidden">
                    {article.imageUrl ? (
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-6xl">📰</span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 bg-muted rounded-full text-xs font-semibold text-muted-foreground">
                          {article.source}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {new Date(article.publishedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-accent transition-colors line-clamp-2">
                        {article.title}
                      </h3>

                      {article.summary && (
                        <p className="text-muted-foreground line-clamp-3">{article.summary}</p>
                      )}
                    </div>

                    {/* Read More */}
                    <div className="mt-4">
                      <span className="text-accent text-sm inline-flex items-center gap-2 hover:underline">
                        Read more
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Empty State */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-16">
            <Newspaper className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-bold text-foreground mb-2">No articles found</h2>
            <p className="text-muted-foreground mb-8">Try a different source or check back later for more news.</p>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
