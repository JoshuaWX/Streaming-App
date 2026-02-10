import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Sidebar from '@/components/sidebar'
import { SidebarProvider } from '@/context/sidebar-context'
import { AuthProvider } from '@/context/auth-context'
import { FavouritesProvider } from '@/context/favourites-context'
import MainContent from '@/components/main-content'
import { Toaster } from '@/components/ui/toaster'

import './globals.css'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FlixStream - Watch Movies & TV Shows',
  description: 'Stream your favorite movies and TV shows on FlixStream',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-background text-foreground">
        <AuthProvider>
          <FavouritesProvider>
            <SidebarProvider>
              <Sidebar />
              <MainContent>{children}</MainContent>
              <Toaster />
            </SidebarProvider>
          </FavouritesProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
