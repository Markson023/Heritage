import Link from 'next/link'
import { ArrowRight, TreeDeciduous, Camera, Bell } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-heritage-50 selection:bg-heritage-200">
      <nav className="border-b border-heritage-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TreeDeciduous className="h-6 w-6 text-heritage-700" />
            <span className="text-2xl font-serif text-heritage-900 font-medium">Heritage</span>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-heritage-700 hover:text-heritage-900 font-medium px-4 py-2 transition-colors"
            >
              Log in
            </Link>
            <Link 
              href="/register" 
              className="bg-heritage-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm hover:bg-heritage-800 transition-colors"
            >
              Start Your Tree
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="px-6 py-24 md:py-32 max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-serif text-heritage-900 leading-tight mb-6">
              Preserve your family&apos;s <br/>
              <span className="text-heritage-600 italic">story & legacy</span>
            </h1>
            <p className="text-xl text-heritage-600 mb-10 leading-relaxed max-w-2xl">
              A private, elegant space to build your interactive family tree, share announcements, and collect memories together with your loved ones.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/register" 
                className="inline-flex justify-center items-center bg-heritage-800 text-white px-8 py-4 rounded-xl font-medium text-lg hover:bg-heritage-900 transition-colors shadow-lg shadow-heritage-900/10"
              >
                Create Family Space <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="bg-white py-24 border-t border-heritage-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-heritage-100 rounded-2xl flex items-center justify-center text-heritage-700">
                  <TreeDeciduous className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-serif text-heritage-900">Interactive Tree</h3>
                <p className="text-heritage-600 leading-relaxed">
                  Map out generations visually. Click on any member to view their complete profile, history, and relationships.
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-heritage-100 rounded-2xl flex items-center justify-center text-heritage-700">
                  <Bell className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-serif text-heritage-900">Family News</h3>
                <p className="text-heritage-600 leading-relaxed">
                  Share important announcements, upcoming birthdays, and organize family meetings in one private dashboard.
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-heritage-100 rounded-2xl flex items-center justify-center text-heritage-700">
                  <Camera className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-serif text-heritage-900">Shared Gallery</h3>
                <p className="text-heritage-600 leading-relaxed">
                  Archive old photographs and recent memories. A collaborative album exclusively accessible to your family.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-heritage-950 py-12 text-center text-heritage-300">
        <p className="text-sm">© {new Date().getFullYear()} Heritage. A private family platform.</p>
      </footer>
    </div>
  )
}
