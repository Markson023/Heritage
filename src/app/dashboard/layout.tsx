import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { TreeDeciduous, Users, Calendar, Image as ImageIcon, LogOut } from 'lucide-react'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
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

  if (!user) {
    redirect('/login')
  }

  // Check if user is in any families
  const { data: familyMembers } = await supabase
    .from('family_members')
    .select('family_id, families(id, name)')
    .eq('user_id', user.id)

  const { data: adminFamilies } = await supabase
    .from('families')
    .select('id, name')
    .eq('admin_id', user.id)

  const hasFamily = (familyMembers && familyMembers.length > 0) || (adminFamilies && adminFamilies.length > 0)

  // Get active family name for display (just take the first one for now)
  const activeFamilyName = adminFamilies?.[0]?.name || (familyMembers?.[0]?.families as any)?.name || null

  return (
    <div className="min-h-screen bg-heritage-50 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-heritage-100 flex flex-col md:min-h-screen fixed md:relative z-10 hidden md:flex">
        <div className="p-6 border-b border-heritage-100">
          <Link href="/dashboard" className="flex items-center gap-2">
            <TreeDeciduous className="h-6 w-6 text-heritage-700" />
            <span className="text-2xl font-serif text-heritage-900 font-medium">Heritage</span>
          </Link>
          {activeFamilyName && (
            <div className="mt-4 px-3 py-1.5 bg-heritage-50 rounded-lg border border-heritage-100">
              <span className="text-xs text-heritage-500 block uppercase tracking-wider font-semibold">Active Space</span>
              <span className="text-sm font-medium text-heritage-900 truncate block">{activeFamilyName}</span>
            </div>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {hasFamily ? (
            <>
              <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-heritage-700 rounded-lg hover:bg-heritage-50 transition-colors font-medium">
                <Users className="h-5 w-5" />
                Overview
              </Link>
              <Link href="/dashboard/tree" className="flex items-center gap-3 px-3 py-2 text-heritage-700 rounded-lg hover:bg-heritage-50 transition-colors font-medium">
                <TreeDeciduous className="h-5 w-5" />
                Family Tree
              </Link>
              <Link href="/dashboard/events" className="flex items-center gap-3 px-3 py-2 text-heritage-700 rounded-lg hover:bg-heritage-50 transition-colors font-medium">
                <Calendar className="h-5 w-5" />
                Events & News
              </Link>
              <Link href="/dashboard/gallery" className="flex items-center gap-3 px-3 py-2 text-heritage-700 rounded-lg hover:bg-heritage-50 transition-colors font-medium">
                <ImageIcon className="h-5 w-5" />
                Gallery
              </Link>
            </>
          ) : (
            <div className="px-3 py-4 text-sm text-heritage-500 text-center">
              Complete setup to unlock navigation
            </div>
          )}
        </nav>

        <div className="p-4 border-t border-heritage-100">
          <form action="/auth/signout" method="post">
            <button className="flex w-full items-center gap-3 px-3 py-2 text-heritage-600 rounded-lg hover:bg-heritage-50 hover:text-red-600 transition-colors font-medium">
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 pb-20 md:pb-0 h-screen overflow-y-auto">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-heritage-100 p-4 flex items-center justify-between sticky top-0 z-20">
          <Link href="/dashboard" className="flex items-center gap-2">
            <TreeDeciduous className="h-6 w-6 text-heritage-700" />
            <span className="text-xl font-serif text-heritage-900 font-medium">Heritage</span>
          </Link>
          <form action="/auth/signout" method="post">
            <button className="p-2 text-heritage-600 hover:text-red-600">
              <LogOut className="h-5 w-5" />
            </button>
          </form>
        </div>

        <div className="p-6 md:p-10 max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      {hasFamily && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-heritage-100 flex justify-around p-3 pb-safe z-20">
          <Link href="/dashboard" className="p-2 text-heritage-700 flex flex-col items-center">
            <Users className="h-6 w-6" />
            <span className="text-[10px] mt-1 font-medium">Overview</span>
          </Link>
          <Link href="/dashboard/tree" className="p-2 text-heritage-700 flex flex-col items-center">
            <TreeDeciduous className="h-6 w-6" />
            <span className="text-[10px] mt-1 font-medium">Tree</span>
          </Link>
          <Link href="/dashboard/events" className="p-2 text-heritage-700 flex flex-col items-center">
            <Calendar className="h-6 w-6" />
            <span className="text-[10px] mt-1 font-medium">Events</span>
          </Link>
          <Link href="/dashboard/gallery" className="p-2 text-heritage-700 flex flex-col items-center">
            <ImageIcon className="h-6 w-6" />
            <span className="text-[10px] mt-1 font-medium">Gallery</span>
          </Link>
        </nav>
      )}
    </div>
  )
}
