'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Mail, Lock, User, Loader2, ArrowRight } from 'lucide-react'

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
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

    // 1. Register Auth user
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      // We will handle passing metadata to create their profile next
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        }
      }
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    // Usually, we'd have a trigger for user creation in Supabase, but for next steps
    // we'll guide them to dashboard where they can create or join a family space.
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-heritage-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-heritage-100">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif text-heritage-900 mb-2">Heritage</h1>
            <p className="text-heritage-600">Join and preserve your family history</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-heritage-400" />
                </div>
                <input
                  id="firstName"
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-heritage-200 rounded-xl focus:ring-2 focus:ring-heritage-500 focus:border-heritage-500 bg-heritage-50/50 text-heritage-900 placeholder:text-heritage-400 transition-colors"
                  placeholder="First name"
                />
              </div>
              <div className="relative">
                <input
                  id="lastName"
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="block w-full px-4 py-3 border border-heritage-200 rounded-xl focus:ring-2 focus:ring-heritage-500 focus:border-heritage-500 bg-heritage-50/50 text-heritage-900 placeholder:text-heritage-400 transition-colors"
                  placeholder="Last name"
                />
              </div>
            </div>

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
                placeholder="Create a password"
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 mt-6 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-heritage-700 hover:bg-heritage-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-heritage-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Create Account <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
        
        <div className="px-8 py-6 bg-heritage-50/50 border-t border-heritage-100 flex flex-col items-center justify-center">
          <p className="text-sm text-heritage-600">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-heritage-700 hover:text-heritage-900 transition-colors">
              Log in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
