'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface WatchPageProps {
  params: {
    id: string
  }
}

const movieData = {
  id: '1',
  title: 'The Last Horizon',
  season: 1,
  episodes: [
    { number: 1, title: 'Departure', duration: '52 min', watched: true },
    { number: 2, title: 'The Void', duration: '48 min', watched: true },
    { number: 3, title: 'First Contact', duration: '55 min', watched: false },
    { number: 4, title: 'The Decision', duration: '50 min', watched: false },
  ],
}

export default function WatchPage({ params }: WatchPageProps) {
  const [volume, setVolume] = useState(80)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [currentTime, setCurrentTime] = useState(35)
  const [duration] = useState(100)
  const [showControls, setShowControls] = useState(true)
  const videoContainerRef = useRef<HTMLDivElement>(null)

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
    setShowControls(true)
  }

  const handleMute = () => {
    setIsMuted(!isMuted)
  }

  const handleFullscreen = () => {
    if (videoContainerRef.current) {
      if (!fullscreen) {
        videoContainerRef.current.requestFullscreen().catch(() => {
          setFullscreen(true)
        })
      } else {
        document.exitFullscreen()
        setFullscreen(false)
      }
    }
  }

  const progressPercent = (currentTime / duration) * 100

  return (
    <div className="bg-background min-h-screen">
      {/* Video Player */}
      <div
        ref={videoContainerRef}
        className={`relative bg-black w-full ${fullscreen ? 'fixed inset-0 z-50' : 'aspect-video'}`}
        onMouseMove={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Video Placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-black flex items-center justify-center text-white text-6xl">
          ▶
        </div>

        {/* Controls */}
        <div
          className={`absolute inset-0 flex flex-col justify-end transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0 hover:opacity-100'
          }`}
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />

          {/* Control Bar */}
          <div className="relative z-10 px-4 pb-4 space-y-3">
            {/* Progress Bar */}
            <div className="group cursor-pointer">
              <div className="bg-gray-600 h-1 rounded-full overflow-hidden hover:h-2 transition-all">
                <div
                  className="bg-accent h-full transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Controls Row */}
            <div className="flex items-center justify-between text-white">
              {/* Left Controls */}
              <div className="flex items-center gap-2">
                {/* Play/Pause */}
                <button
                  onClick={handlePlayPause}
                  className="hover:bg-white/20 p-2 rounded transition-colors"
                  aria-label="Play/Pause"
                >
                  {isPlaying ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>

                {/* Volume */}
                <div className="flex items-center gap-2 group">
                  <button
                    onClick={handleMute}
                    className="hover:bg-white/20 p-2 rounded transition-colors"
                    aria-label="Mute"
                  >
                    {isMuted || volume === 0 ? (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C23.16 14.55 24 12.37 24 10c0-4.97-4.03-9-9-9-2.37 0-4.55.84-6.29 2.24l1.58 1.58C10.18 3.02 11.82 2 13.5 2c3.59 0 6.5 2.91 6.5 6.5zm-.82.82l2.15 2.15c.26-.67.42-1.4.42-2.15 0-3.04-2.46-5.5-5.5-5.5-.75 0-1.48.16-2.15.42l2.15 2.15c.41.9.64 1.89.64 2.93 0 1.04-.23 2.03-.64 2.93zM2.81 2.81L1.39 4.22 7 9.83v.01H3v6h4v5h2v-5h4v-2.17l5.78 5.78 1.41-1.41L2.81 2.81z" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                      </svg>
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => setVolume(parseInt(e.target.value))}
                    className="w-0 group-hover:w-16 transition-all h-1 cursor-pointer"
                  />
                  <span className="text-sm w-0 group-hover:w-8 transition-all overflow-hidden">
                    {volume}%
                  </span>
                </div>

                {/* Time */}
                <span className="text-sm ml-auto">
                  {Math.floor(currentTime)}m / {Math.floor(duration)}m
                </span>
              </div>

              {/* Right Controls */}
              <div className="flex items-center gap-2 ml-auto">
                <button className="hover:bg-white/20 p-2 rounded transition-colors" aria-label="Settings">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>

                <button
                  onClick={handleFullscreen}
                  className="hover:bg-white/20 p-2 rounded transition-colors"
                  aria-label="Fullscreen"
                >
                  {fullscreen ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Episode/Info Section */}
      {!fullscreen && (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="md:col-span-2">
              <div className="mb-6">
                <Link href={`/movie/${movieData.id}`} className="text-accent hover:underline text-sm mb-2 block">
                  Back to details
                </Link>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {movieData.title}
                </h1>
                <p className="text-muted-foreground">
                  Season {movieData.season} • Episode 2 • The Void
                </p>
              </div>

              {/* Episode Description */}
              <div className="bg-card border border-border rounded-lg p-6 mb-6">
                <h3 className="text-lg font-bold text-foreground mb-2">Episode Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  The crew encounters their first major crisis as the ship's systems begin to fail. Tensions 
                  rise as the team must work together to survive the harsh conditions of space. Unexpected 
                  discoveries challenge everything they thought they knew about their mission.
                </p>
              </div>

              {/* Next Episode */}
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground w-full">
                Next Episode
              </Button>
            </div>

            {/* Episodes List */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Episodes</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {movieData.episodes.map((ep) => (
                  <Link
                    key={ep.number}
                    href={`/watch/${movieData.id}?ep=${ep.number}`}
                    className={`p-3 rounded-lg transition-colors cursor-pointer ${
                      ep.number === 2
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-input hover:bg-input/80 text-foreground'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-sm">
                          Ep {ep.number}: {ep.title}
                        </p>
                        <p className="text-xs opacity-75">{ep.duration}</p>
                      </div>
                      {ep.watched && (
                        <span className="text-lg">✓</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
