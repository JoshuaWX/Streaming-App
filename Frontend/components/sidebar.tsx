'use client'

import Link from 'next/link'
import { Home, Search, Heart, Bell, User, Menu, X, Bookmark, Newspaper } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSidebar } from '@/context/sidebar-context'

export default function Sidebar() {
  const { isOpen, toggleSidebar } = useSidebar()

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen bg-card border-r border-border transition-all duration-300 ${
          isOpen ? 'w-16' : 'w-0'
        } overflow-hidden`}
      >
        <div className="flex flex-col items-center gap-6 pt-6">
          {/* Logo */}
          <Link
            href="/"
            className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center hover:opacity-80 transition flex-shrink-0"
          >
            <span className="text-accent-foreground font-bold text-lg">F</span>
          </Link>

          {/* Navigation Icons */}
          <nav className="flex flex-col gap-6">
            <Link href="/" title="Home">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-lg hover:bg-muted"
              >
                <Home className="w-5 h-5" />
              </Button>
            </Link>

            <Link href="/search" title="Search">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-lg hover:bg-muted"
              >
                <Search className="w-5 h-5" />
              </Button>
            </Link>

            <Link href="/my-list" title="My List">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-lg hover:bg-muted"
              >
                <Heart className="w-5 h-5" />
              </Button>
            </Link>

            <Link href="/notifications" title="Notifications">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-lg hover:bg-muted"
              >
                <Bell className="w-5 h-5" />
              </Button>
            </Link>

            <Link href="/watchlist" title="Watchlist">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-lg hover:bg-muted"
              >
                <Bookmark className="w-5 h-5" />
              </Button>
            </Link>

            <Link href="/news" title="News">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-lg hover:bg-muted"
              >
                <Newspaper className="w-5 h-5" />
              </Button>
            </Link>

            <Link href="/login" title="Profile">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-lg hover:bg-muted"
              >
                <User className="w-5 h-5" />
              </Button>
            </Link>
          </nav>

          {/* Hamburger Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-10 w-10 rounded-lg hover:bg-muted mt-auto mb-6"
            title="Toggle Sidebar"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </aside>

      {/* Hamburger Button (when sidebar is closed) */}
      {!isOpen && (
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="fixed left-4 top-4 z-40 h-10 w-10 rounded-lg hover:bg-muted"
          title="Open Sidebar"
        >
          <Menu className="w-5 h-5" />
        </Button>
      )}
    </>
  )
}
