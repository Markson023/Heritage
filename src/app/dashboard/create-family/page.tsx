'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2, ArrowRight } from 'lucide-react'

export default function CreateFamilyPage() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    // Insert family
    const { data: family, error: familyError } = await supabase
      .from('families')
      .insert({
        name,
        description,
        location,
        admin_id: user.id
      })
      .select()
      .single()

    if (familyError) {
      setError(familyError.message)
      setLoading(false)
      return
    }

    // Automatically add the admin as the first family member node in the tree!
    // Fetch user profile first
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

    if (profile) {
      await supabase.from('family_members').insert({
        family_id: family.id,
        user_id: user.id,
        first_name: profile.first_name || 'Admin',
        last_name: profile.last_name || 'User',
      })
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-white p-8 md:p-10 rounded-3xl border border-heritage-100 shadow-sm">
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-heritage-900 mb-2">Create Family Space</h1>
        <p className="text-heritage-600">
          Setup the primary hub for your family. You can invite other members later.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm border border-red-100">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-heritage-900">
            Family Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            required
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="block w-full px-4 py-3 border border-heritage-200 rounded-xl focus:ring-2 focus:ring-heritage-500 focus:border-heritage-500 bg-heritage-50/50 text-heritage-900 transition-colors"
            placeholder="e.g. The Smith Family"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium text-heritage-900">
            Description (Optional)
          </label>
          <textarea
            id="description"
            rows={3}
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="block w-full px-4 py-3 border border-heritage-200 rounded-xl focus:ring-2 focus:ring-heritage-500 focus:border-heritage-500 bg-heritage-50/50 text-heritage-900 transition-colors resize-none"
            placeholder="A short description about your family's history or values..."
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="location" className="block text-sm font-medium text-heritage-900">
            Origin / Primary Location (Optional)
          </label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={e => setLocation(e.target.value)}
            className="block w-full px-4 py-3 border border-heritage-200 rounded-xl focus:ring-2 focus:ring-heritage-500 focus:border-heritage-500 bg-heritage-50/50 text-heritage-900 transition-colors"
            placeholder="e.g. Paris, France"
          />
        </div>

        <div className="pt-6 border-t border-heritage-100 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 bg-white text-heritage-700 font-medium border border-heritage-200 rounded-xl shadow-sm hover:bg-heritage-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-xl shadow-sm font-medium text-white bg-heritage-700 hover:bg-heritage-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-heritage-500 disabled:opacity-50 transition-colors min-w-[160px]"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                Create Space <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
