'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Heart, Bell, User, Menu, X, Bookmark, Newspaper, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSidebar } from '@/context/sidebar-context'
import { useAuth } from '@/context/auth-context'
import { cn } from '@/lib/utils'

interface NavItem {
  href: string
  icon: React.ReactNode
  title: string
}

export default function Sidebar() {
  const { isOpen, toggleSidebar } = useSidebar()
  const { user, signOut } = useAuth()
  const pathname = usePathname()

  const navItems: NavItem[] = [
    { href: '/', icon: <Home className="w-5 h-5" />, title: 'Home' },
    { href: '/search', icon: <Search className="w-5 h-5" />, title: 'Search' },
    { href: '/favourites', icon: <Heart className="w-5 h-5" />, title: 'Favourites' },
    { href: '/notifications', icon: <Bell className="w-5 h-5" />, title: 'Notifications' },
    { href: '/watchlist', icon: <Bookmark className="w-5 h-5" />, title: 'Watchlist' },
    { href: '/news', icon: <Newspaper className="w-5 h-5" />, title: 'News' },
  ]

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

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
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} title={item.title}>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'h-10 w-10 rounded-lg',
                    isActive(item.href)
                      ? 'bg-accent text-accent-foreground hover:bg-accent/90'
                      : 'hover:bg-muted',
                  )}
                >
                  {item.icon}
                </Button>
              </Link>
            ))}

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
                  className={cn(
                    'h-10 w-10 rounded-lg',
                    isActive('/login')
                      ? 'bg-accent text-accent-foreground hover:bg-accent/90'
                      : 'hover:bg-muted',
                  )}
                >
                  <User className="w-5 h-5" />
                </Button>
              </Link>
            )}
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
