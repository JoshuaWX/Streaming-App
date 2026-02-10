'use client'

import Link from 'next/link'
import { Play, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function HeroSection() {
  return (
    <section className="relative h-[60vh] md:h-[70vh] overflow-hidden bg-gradient-to-b from-background via-card to-background">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-background/20" />

      {/* Hero Content */}
      <div className="relative h-full flex items-center justify-start">
        <div className="max-w-2xl px-4 md:px-6 lg:px-8 space-y-6 pt-20">
          {/* Title */}
          <div className="space-y-4">
            <p className="text-accent text-sm font-semibold uppercase tracking-wider">Featured Now</p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
              The Last Horizon
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">
              An epic adventure across distant worlds. Join our heroes as they discover mysteries that will change their fate forever.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4 pt-4">
            <Link href="/play">
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
              >
                <Play className="w-5 h-5 mr-2" />
                Play Now
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-muted-foreground text-foreground hover:bg-muted/10 bg-transparent"
            >
              <Info className="w-5 h-5 mr-2" />
              More Info
            </Button>
          </div>

          {/* Meta Info */}
          <div className="flex items-center gap-6 pt-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="bg-accent/20 text-accent px-3 py-1 rounded-full font-semibold">18+</span>
            </div>
            <span className="text-muted-foreground">2 hours 45 minutes</span>
            <span className="text-muted-foreground">2024</span>
          </div>
        </div>
      </div>
    </section>
  )
}
