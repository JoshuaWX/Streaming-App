'use client'

import { useState } from 'react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'

interface Notification {
  id: string
  type: 'new-release' | 'watchlist' | 'recommendation' | 'account'
  title: string
  message: string
  timestamp: string
  read: boolean
  icon: string
}

const initialNotifications: Notification[] = [
  {
    id: '1',
    type: 'new-release',
    title: 'New Release Available',
    message: '"The Final Quest" is now available to stream',
    timestamp: '2 hours ago',
    read: false,
    icon: '🎬',
  },
  {
    id: '2',
    type: 'watchlist',
    title: 'Watchlist Update',
    message: '"Crimson Skies" has been added to your recommendations',
    timestamp: '5 hours ago',
    read: false,
    icon: '📌',
  },
  {
    id: '3',
    type: 'recommendation',
    title: 'Personalized Recommendation',
    message: 'Based on your viewing, you might like "Beyond the Stars"',
    timestamp: '1 day ago',
    read: true,
    icon: '⭐',
  },
  {
    id: '4',
    type: 'new-release',
    title: 'New Series Available',
    message: 'Season 2 of "Midnight Chronicles" is now available',
    timestamp: '2 days ago',
    read: true,
    icon: '📺',
  },
  {
    id: '5',
    type: 'account',
    title: 'Account Update',
    message: 'Your subscription has been successfully renewed',
    timestamp: '3 days ago',
    read: true,
    icon: '✓',
  },
  {
    id: '6',
    type: 'recommendation',
    title: 'Trending Content',
    message: '"The Last Horizon" is trending among viewers like you',
    timestamp: '4 days ago',
    read: true,
    icon: '🔥',
  },
]

const notificationIcons: Record<string, string> = {
  'new-release': '🎬',
  'watchlist': '📌',
  'recommendation': '⭐',
  'account': '✓',
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [filter, setFilter] = useState<'all' | 'unread' | 'new-release' | 'recommendation'>('all')

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === 'all') return true
    if (filter === 'unread') return !notif.read
    return notif.type === filter
  })

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const handleClearAll = () => {
    setNotifications([])
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <div className="bg-card border-b border-border py-12 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-2">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}` : 'All notifications read'}
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        {notifications.length > 0 ? (
          <>
            {/* Controls */}
            <div className="flex flex-wrap gap-3 items-center justify-between mb-8">
              <div className="flex flex-wrap gap-2">
                <span className="text-muted-foreground text-sm self-center">Filter:</span>
                {(
                  [
                    { value: 'all' as const, label: 'All' },
                    { value: 'unread' as const, label: `Unread (${unreadCount})` },
                    { value: 'new-release' as const, label: 'New Releases' },
                    { value: 'recommendation' as const, label: 'Recommendations' },
                  ] as const
                ).map(({ value, label }) => (
                  <Button
                    key={value}
                    onClick={() => setFilter(value)}
                    variant={filter === value ? 'default' : 'outline'}
                    className={`text-sm ${
                      filter === value
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-input border-border text-foreground hover:bg-input/80'
                    }`}
                  >
                    {label}
                  </Button>
                ))}
              </div>

              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <Button
                    onClick={handleMarkAllAsRead}
                    variant="outline"
                    className="bg-input border-border text-foreground hover:bg-input/80 text-sm"
                  >
                    Mark all as read
                  </Button>
                )}
                {notifications.length > 0 && (
                  <Button
                    onClick={handleClearAll}
                    variant="outline"
                    className="bg-input border-border text-foreground hover:bg-input/80 text-sm"
                  >
                    Clear all
                  </Button>
                )}
              </div>
            </div>

            {/* Notifications List */}
            {filteredNotifications.length > 0 ? (
              <div className="space-y-3">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border transition-colors cursor-pointer hover:bg-input/50 ${
                      notification.read
                        ? 'bg-transparent border-border'
                        : 'bg-accent/5 border-accent'
                    }`}
                  >
                    <div className="flex gap-4 items-start">
                      {/* Icon */}
                      <div className="text-3xl flex-shrink-0 pt-1">{notification.icon}</div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground mb-1">
                          {notification.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {notification.timestamp}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 flex-shrink-0">
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="px-3 py-1 bg-accent hover:bg-accent/90 text-accent-foreground rounded text-xs font-semibold transition-colors"
                          >
                            Mark read
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="px-3 py-1 bg-input hover:bg-input/80 text-foreground rounded text-xs transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No notifications in this category</p>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-4">🔔</div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">No notifications</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              You're all caught up! New notifications will appear here when there's activity related to your account.
            </p>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
              Notification Settings
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
