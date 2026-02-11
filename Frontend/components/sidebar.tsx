'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Heart, Bell, User, Bookmark, Newspaper, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/auth-context'

export default function Sidebar() {
  const { user, signOut } = useAuth()
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-16 bg-card border-r border-border overflow-hidden">
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
              className={`h-10 w-10 rounded-lg hover:bg-muted ${pathname === '/' ? 'bg-muted' : ''}`}
            >
              <Home className="w-5 h-5" />
            </Button>
          </Link>

          <Link href="/search" title="Search">
            <Button
              variant="ghost"
              size="icon"
              className={`h-10 w-10 rounded-lg hover:bg-muted ${pathname === '/search' ? 'bg-muted' : ''}`}
            >
              <Search className="w-5 h-5" />
            </Button>
          </Link>

          <Link href="/my-list" title="My List">
            <Button
              variant="ghost"
              size="icon"
              className={`h-10 w-10 rounded-lg hover:bg-muted ${pathname === '/my-list' ? 'bg-muted' : ''}`}
            >
              <Heart className="w-5 h-5" />
            </Button>
          </Link>

          <Link href="/notifications" title="Notifications">
            <Button
              variant="ghost"
              size="icon"
              className={`h-10 w-10 rounded-lg hover:bg-muted ${pathname === '/notifications' ? 'bg-muted' : ''}`}
            >
              <Bell className="w-5 h-5" />
            </Button>
          </Link>

          <Link href="/watchlist" title="Watchlist">
            <Button
              variant="ghost"
              size="icon"
              className={`h-10 w-10 rounded-lg hover:bg-muted ${pathname === '/watchlist' ? 'bg-muted' : ''}`}
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

          {user ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-lg hover:bg-muted"
              title="Sign Out"
              onClick={() => signOut()}
            >
              <LogOut className="w-5 h-5" />
            </Button>
          ) : (
            <Link href="/login" title="Sign In">
              <Button
                variant="ghost"
                size="icon"
                className={`h-10 w-10 rounded-lg hover:bg-muted ${pathname === '/login' ? 'bg-muted' : ''}`}
              >
                <User className="w-5 h-5" />
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </aside>
  )
}
