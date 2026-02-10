'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function MoviePlayerPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(120)
  const [showControls, setShowControls] = useState(true)

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const handleFullscreen = () => {
    const player = document.getElementById('video-player')
    if (player) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        player.requestFullscreen()
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Video Player Container */}
      <div
        id="video-player"
        className="w-full bg-black relative group"
        onMouseMove={() => setShowControls(true)}
        onMouseLeave={() => !isPlaying && setShowControls(false)}
      >
        {/* Video Background */}
        <div className="w-full h-screen bg-gradient-to-br from-card to-background flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="w-12 h-12 text-accent" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">The Last Horizon</h2>
            <p className="text-muted-foreground">Movie Player Demo</p>
          </div>
        </div>

        {/* Video Controls */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Progress Bar */}
          <div className="mb-4">
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={(e) => setCurrentTime(Number(e.target.value))}
              className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-accent"
            />
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Play/Pause */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePlayPause}
                className="h-9 w-9 hover:bg-accent/20"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </Button>

              {/* Skip Back */}
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 hover:bg-accent/20"
              >
                <SkipBack className="w-5 h-5" />
              </Button>

              {/* Skip Forward */}
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 hover:bg-accent/20"
              >
                <SkipForward className="w-5 h-5" />
              </Button>

              {/* Mute Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className="h-9 w-9 hover:bg-accent/20"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </Button>

              {/* Time Display */}
              <span className="text-sm text-foreground ml-4">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Settings */}
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 hover:bg-accent/20"
              >
                <Settings className="w-5 h-5" />
              </Button>

              {/* Fullscreen */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleFullscreen}
                className="h-9 w-9 hover:bg-accent/20"
              >
                <Maximize className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">The Last Horizon</h1>
          <p className="text-muted-foreground mb-4">
            A thrilling sci-fi adventure about humanity's final journey to the stars.
          </p>
          <div className="flex gap-4">
            <Button
              variant="default"
              onClick={handlePlayPause}
              className="bg-accent hover:bg-accent/90"
            >
              {isPlaying ? 'Pause' : 'Resume'}
            </Button>
            <Link href="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
        </div>

        {/* Episode List / Related Content */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-foreground mb-4">More Like This</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Link key={i} href="/play" className="group cursor-pointer">
                <div className="bg-card rounded-lg overflow-hidden hover:opacity-80 transition">
                  <div className="aspect-video bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center">
                    <Play className="w-8 h-8 text-accent opacity-0 group-hover:opacity-100 transition" />
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-foreground text-sm">Related Movie {i}</h3>
                    <p className="text-xs text-muted-foreground">2024</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
