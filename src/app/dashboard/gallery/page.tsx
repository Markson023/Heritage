import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Image as ImageIcon, Upload, FileImage, Video } from 'lucide-react'

export default async function GalleryPage() {
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

  // Fetch gallery items
  const { data: galleryItems } = await supabase
    .from('gallery')
    .select(`
      id, title, description, photo_url, date, created_at,
      profiles (first_name, last_name)
    `)
    .eq('family_id', family.id)
    .order('created_at', { ascending: false })

  return (
    <div className="h-full flex flex-col">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif text-heritage-900 mb-2">Family Gallery</h1>
          <p className="text-heritage-600">A collection of cherished memories.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-heritage-700 text-white rounded-lg hover:bg-heritage-800 transition-colors shadow-sm font-medium">
          <Upload className="h-4 w-4" /> Upload Media
        </button>
      </div>

      {!galleryItems || galleryItems.length === 0 ? (
        <div className="flex-1 border-2 border-dashed border-heritage-200 rounded-3xl bg-heritage-50/50 flex flex-col items-center justify-center text-center p-12">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-heritage-300 shadow-sm border border-heritage-100 mb-6">
            <ImageIcon className="h-10 w-10 text-heritage-400" />
          </div>
          <h3 className="text-xl font-medium text-heritage-900 mb-2">Your gallery is empty</h3>
          <p className="text-heritage-600 max-w-sm mx-auto mb-8">
            Start archiving your family&apos;s history! Upload photos, scanned documents, and memories to share with everyone.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="flex flex-col items-center justify-center w-24 h-24 bg-white border border-heritage-200 rounded-2xl hover:bg-heritage-50 transition-colors shadow-sm text-heritage-700 group">
              <FileImage className="h-6 w-6 mb-2 text-heritage-400 group-hover:text-heritage-700 transition-colors" />
              <span className="text-xs font-medium">Photos</span>
            </button>
            <button className="flex flex-col items-center justify-center w-24 h-24 bg-white border border-heritage-200 rounded-2xl hover:bg-heritage-50 transition-colors shadow-sm text-heritage-700 group">
              <Video className="h-6 w-6 mb-2 text-heritage-400 group-hover:text-heritage-700 transition-colors" />
              <span className="text-xs font-medium">Videos</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 pb-12">
          {galleryItems.map((item: any) => (
            <div key={item.id} className="group relative aspect-square bg-heritage-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-heritage-200 cursor-pointer">
              {/* Using native img to avoid next/image domain configuration issues out-of-the-box */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={item.photo_url} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <h4 className="text-white font-medium truncate">{item.title}</h4>
                {item.profiles && (
                  <p className="text-white/70 text-xs mt-1">
                    Added by {item.profiles.first_name} {item.profiles.last_name}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
