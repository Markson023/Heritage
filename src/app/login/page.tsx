'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-heritage-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-heritage-100">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif text-heritage-900 mb-2">Heritage</h1>
            <p className="text-heritage-600">Log in to your family space</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-heritage-800 hidden" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-heritage-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-heritage-200 rounded-xl focus:ring-2 focus:ring-heritage-500 focus:border-heritage-500 bg-heritage-50/50 text-heritage-900 placeholder:text-heritage-400 transition-colors"
                  placeholder="Email address"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-heritage-800 hidden" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-heritage-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-heritage-200 rounded-xl focus:ring-2 focus:ring-heritage-500 focus:border-heritage-500 bg-heritage-50/50 text-heritage-900 placeholder:text-heritage-400 transition-colors"
                  placeholder="Password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-heritage-700 hover:bg-heritage-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-heritage-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Connect <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
        
        <div className="px-8 py-6 bg-heritage-50/50 border-t border-heritage-100 flex flex-col items-center justify-center">
          <p className="text-sm text-heritage-600">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-medium text-heritage-700 hover:text-heritage-900 transition-colors">
              Create one now
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
