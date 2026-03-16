import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { Users, Plus, Link as LinkIcon } from 'lucide-react'

export default async function DashboardOverview() {
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

  // Find families
  const { data: adminFamilies } = await supabase
    .from('families')
    .select('*')
    .eq('admin_id', user?.id)

  const hasFamily = (adminFamilies && adminFamilies.length > 0)

  if (!hasFamily) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-serif text-heritage-900 mb-4">Welcome to Heritage</h1>
          <p className="text-lg text-heritage-600">
            You don&apos;t belong to any family space yet. Choose an option to get started.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-2xl border border-heritage-200 shadow-sm hover:border-heritage-300 transition-colors flex flex-col h-full">
            <div className="w-12 h-12 bg-heritage-100 rounded-xl flex items-center justify-center text-heritage-700 mb-6">
              <Plus className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-medium text-heritage-900 mb-2">Create a New Family</h2>
            <p className="text-heritage-600 mb-8 flex-1">
              Start building your own family tree. You will be the administrator and can invite others.
            </p>
            <Link 
              href="/dashboard/create-family" 
              className="w-full text-center py-3 bg-heritage-700 text-white font-medium rounded-xl hover:bg-heritage-800 transition-colors block"
            >
              Create Space
            </Link>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-heritage-200 shadow-sm hover:border-heritage-300 transition-colors flex flex-col h-full">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-700 mb-6">
              <LinkIcon className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">Join Existing Family</h2>
            <p className="text-gray-600 mb-8 flex-1">
              If an administrator has sent you an invitation link, click it directly to join their space.
            </p>
            <div className="w-full text-center py-3 bg-gray-50 text-gray-500 font-medium rounded-xl border border-gray-200 cursor-not-allowed">
              Waiting for invite link...
            </div>
          </div>
        </div>
      </div>
    )
  }

  // They have a family! Show dashboard.
  const activeFamily = adminFamilies[0]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-heritage-900 mb-2">{activeFamily.name} Dashboard</h1>
        {activeFamily.description && (
          <p className="text-heritage-600">{activeFamily.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/dashboard/tree" className="bg-white p-6 rounded-2xl border border-heritage-100 shadow-sm hover:shadow-md hover:border-heritage-300 transition-all group">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-medium text-heritage-900 group-hover:text-heritage-700 transition-colors">Family Tree</h3>
            <Users className="h-5 w-5 text-heritage-400" />
          </div>
          <p className="text-sm text-heritage-600">View and edit your interactive family genealogy.</p>
        </Link>
        
        {/* We will build more cards here (gallery, events, announcements) later */}
      </div>
    </div>
  )
}
