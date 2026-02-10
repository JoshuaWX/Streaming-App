'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, Bell, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/search', label: 'Browse' },
    { href: '/favourites', label: 'Favourites' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-accent-foreground font-bold text-lg">F</span>
            </div>
            <span className="text-xl font-bold text-foreground hidden sm:block">FlixStream</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm transition',
                  isActive(link.href)
                    ? 'text-accent font-semibold'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search and User */}
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              {searchOpen ? (
                <Link href="/search" className="block">
                  <Input
                    type="search"
                    placeholder="Search movies..."
                    className="w-32 h-9 bg-muted text-foreground placeholder:text-muted-foreground border-border"
                    autoFocus
                  />
                </Link>
              ) : (
                <Link href="/search">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9"
                  >
                    <Search className="w-4 h-4" />
                  </Button>
                </Link>
              )}
            </div>

            <Link href="/notifications">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Bell className="w-4 h-4" />
              </Button>
            </Link>

            <Link href="/login">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <User className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
