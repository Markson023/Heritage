import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import FamilyTreeView from '@/components/tree/FamilyTreeView'

export default async function FamilyTreePage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // 1. Find user's families
  const { data: adminFamilies } = await supabase
    .from('families')
    .select('*')
    .eq('admin_id', user.id)

  const family = adminFamilies?.[0]

  if (!family) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-serif text-heritage-900 mb-4">No Family Space Found</h2>
        <p className="text-heritage-600 mb-8">You need to create a family space first to view the tree.</p>
        <Link 
          href="/dashboard/create-family" 
          className="px-6 py-3 bg-heritage-700 text-white font-medium rounded-xl hover:bg-heritage-800 transition-colors"
        >
          Create Family Space
        </Link>
      </div>
    )
  }

  // 2. Fetch all members and relationships for this family
  const { data: members } = await supabase
    .from('family_members')
    .select('*')
    .eq('family_id', family.id)

  const { data: relationships } = await supabase
    .from('relationships')
    .select('id, member_id_1, member_id_2, relationship_type')
    // We would need to ensure these are filtered by family, but RLS does this for us.
    // For safety and performance, ideally we'd filter through a join, but RLS applies.

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] md:h-[calc(100vh-80px)]">
      <div className="mb-6 flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-3xl font-serif text-heritage-900 mb-2">Family Tree</h1>
          <p className="text-heritage-600">Visualizing the {family.name} lineage</p>
        </div>
        <button 
          className="flex items-center gap-2 px-4 py-2 bg-heritage-700 text-white rounded-lg hover:bg-heritage-800 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Member</span>
        </button>
      </div>

      <div className="flex-1 bg-white border border-heritage-100 rounded-2xl shadow-sm overflow-hidden relative">
        <FamilyTreeView 
          familyId={family.id}
          initialMembers={members || []} 
          initialRelationships={relationships || []} 
        />
      </div>
    </div>
  )
}
