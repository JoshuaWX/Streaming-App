'use client'

import React from "react"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/context/auth-context'

export default function LoginPage() {
  const router = useRouter()
  const { signIn, signUp, signInWithProvider, user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)

  // If already logged in, redirect
  if (user) {
    router.push('/')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email')
      return
    }

    if (isSignUp && password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      const result = isSignUp
        ? await signUp(email, password)
        : await signIn(email, password)

      if (result.error) {
        setError(result.error)
      } else {
        if (isSignUp) {
          setError('')
          // Show success message for sign up (email confirmation may be required)
          setError('Check your email for a confirmation link!')
        } else {
          router.push('/')
        }
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleOAuth = async (provider: 'google' | 'github') => {
    setLoading(true)
    const result = await signInWithProvider(provider)
    if (result.error) {
      setError(result.error)
      setLoading(false)
    }
    // OAuth redirects away, so no need to handle success here
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-accent mb-2">FlixStream</h1>
          <p className="text-muted-foreground">
            {isSignUp ? 'Create your account' : 'Sign in to your account'}
          </p>
        </div>

        {/* Login Card */}
        <Card className="bg-card border-border p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error / Success Message */}
            {error && (
              <div className={`p-3 rounded-lg border ${
                error.includes('Check your email')
                  ? 'bg-green-500/10 border-green-500'
                  : 'bg-red-500/10 border-accent'
              }`}>
                <p className={`text-sm text-center ${
                  error.includes('Check your email') ? 'text-green-500' : 'text-accent'
                }`}>{error}</p>
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                disabled={loading}
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-foreground">
                  Password
                </label>
                {!isSignUp && (
                  <Link href="/forgot-password" className="text-xs text-accent hover:underline">
                    Forgot password?
                  </Link>
                )}
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                disabled={loading}
              />
            </div>

            {/* Remember Me */}
            {!isSignUp && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded accent-accent cursor-pointer"
                />
                <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                  Remember me
                </label>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-2 h-10"
            >
              {loading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Sign In'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">Or continue with</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => handleOAuth('google')}
              className="bg-input border-border text-foreground hover:bg-input/80"
            >
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => handleOAuth('github')}
              className="bg-input border-border text-foreground hover:bg-input/80"
            >
              GitHub
            </Button>
          </div>
        </Card>

        {/* Toggle Sign Up / Sign In */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
            className="text-accent hover:underline font-semibold"
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </button>
        </p>

        {/* Skip Link */}
        <p className="text-center text-xs text-muted-foreground mt-4">
          <Link href="/" className="text-accent hover:underline">
            Continue as guest
          </Link>
        </p>
      </div>
    </div>
  )
}
