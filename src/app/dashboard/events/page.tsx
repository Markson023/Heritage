import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { Calendar as CalendarIcon, Bell, Plus } from 'lucide-react'

export default async function EventsPage() {
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

  // Find user's families
  const { data: adminFamilies } = await supabase
    .from('families')
    .select('*')
    .eq('admin_id', user.id)

  const family = adminFamilies?.[0]
  if (!family) return null // Handled by layout/index theoretically

  // Fetch announcements
  const { data: announcements } = await supabase
    .from('announcements')
    .select(`
      id, title, description, event_date, created_at,
      profiles (first_name, last_name, avatar_url)
    `)
    .eq('family_id', family.id)
    .order('created_at', { ascending: false })

  // Fetch events
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('family_id', family.id)
    .order('event_date', { ascending: true })

  return (
    <div>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif text-heritage-900 mb-2">Family News & Events</h1>
          <p className="text-heritage-600">Stay updated with {family.name}&apos;s latest happenings.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-heritage-200 text-heritage-700 rounded-lg hover:bg-heritage-50 transition-colors shadow-sm font-medium">
            <Plus className="h-4 w-4" /> Add Event
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-heritage-700 text-white rounded-lg hover:bg-heritage-800 transition-colors shadow-sm font-medium">
            <Bell className="h-4 w-4" /> Post Announcement
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Main Feed: Announcements */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-serif text-heritage-900 flex items-center gap-2 px-1">
            <Bell className="h-5 w-5 text-heritage-500" /> Recent Announcements
          </h2>
          
          {!announcements || announcements.length === 0 ? (
            <div className="bg-white border border-heritage-100 rounded-2xl p-12 text-center shadow-sm">
              <div className="w-12 h-12 bg-heritage-50 rounded-full flex items-center justify-center mx-auto mb-4 text-heritage-400">
                <Bell className="h-6 w-6" />
              </div>
              <p className="text-heritage-600 mb-2">No announcements yet.</p>
              <p className="text-sm text-heritage-400">Be the first to share some news with the family!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {announcements.map((announcement: any) => (
                <div key={announcement.id} className="bg-white border border-heritage-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-heritage-100 border border-heritage-200 overflow-hidden flex items-center justify-center text-heritage-600 font-medium text-sm">
                        {announcement.profiles?.avatar_url ? (
                          <img src={announcement.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <>{announcement.profiles?.first_name?.[0]}{announcement.profiles?.last_name?.[0]}</>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-heritage-900">
                          {announcement.profiles?.first_name} {announcement.profiles?.last_name}
                        </p>
                        <p className="text-xs text-heritage-500">
                          {new Date(announcement.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-medium text-heritage-900 mb-2">{announcement.title}</h3>
                  <p className="text-heritage-700 whitespace-pre-line leading-relaxed">
                    {announcement.description}
                  </p>
                  {announcement.event_date && (
                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-heritage-50 text-heritage-800 text-sm font-medium rounded-lg border border-heritage-100">
                      <CalendarIcon className="h-4 w-4 text-heritage-500" />
                      Event on {new Date(announcement.event_date).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar: Upcoming Events */}
        <div className="space-y-6">
          <h2 className="text-xl font-serif text-heritage-900 flex items-center gap-2 px-1">
            <CalendarIcon className="h-5 w-5 text-heritage-500" /> Upcoming Events
          </h2>
          
          <div className="bg-white border border-heritage-100 rounded-2xl p-6 shadow-sm">
            {!events || events.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-heritage-500 text-sm">No upcoming family events scheduled.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {events.map((event: any) => {
                  const eventDate = new Date(event.event_date)
                  return (
                    <div key={event.id} className="flex gap-4 items-start group">
                      <div className="flex flex-col items-center justify-center w-12 h-14 bg-heritage-50 rounded-xl border border-heritage-100 shrink-0 group-hover:bg-heritage-700 group-hover:text-white transition-colors">
                        <span className="text-xs font-semibold uppercase">{eventDate.toLocaleDateString(undefined, { month: 'short' })}</span>
                        <span className="text-lg font-bold leading-none">{eventDate.getDate()}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-heritage-900">{event.title}</h4>
                        <p className="text-xs text-heritage-500 mt-1 capitalize">{event.event_type || 'Family Event'}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
            
            <button className="w-full mt-6 py-2.5 bg-heritage-50 text-heritage-800 hover:bg-heritage-100 transition-colors rounded-xl text-sm font-medium border border-heritage-200">
              View Full Calendar
            </button>
          </div>
        </div>
        
      </div>
    </div>
  )
}
