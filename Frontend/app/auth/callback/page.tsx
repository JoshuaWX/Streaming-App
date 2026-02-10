'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

/**
 * OAuth callback handler.
 * Supabase redirects here after Google/GitHub sign-in with a code in the URL.
 * The Supabase client exchanges it for a session, then we redirect to home.
 */
export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    // supabase client auto-detects the code/hash in the URL via detectSessionInUrl
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        router.replace('/')
      }
    })

    // Fallback: if session already exists after exchange, redirect
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace('/')
      }
    })
  }, [router])

  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4" />
        <p className="text-muted-foreground">Completing sign in...</p>
      </div>
    </main>
  )
}
