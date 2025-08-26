import { Suspense } from 'react'
import { getSiteSettings, getActiveAnnouncements } from '@/lib/cosmic'
import EnhancedStreamPlayer from '@/components/EnhancedStreamPlayer'
import AnnouncementBanner from '@/components/AnnouncementBanner'
import Header from '@/components/Header'
import CosmicBadge from '@/components/CosmicBadge'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function StreamPlayerSkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border animate-pulse">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="aspect-video bg-gray-200 rounded-lg animate-pulse"></div>
    </div>
  )
}

export default async function HomePage() {
  // Fetch data in parallel
  const [siteSettings, announcements] = await Promise.allSettled([
    getSiteSettings(),
    getActiveAnnouncements()
  ])

  // Extract results with fallbacks
  const settings = siteSettings.status === 'fulfilled' ? siteSettings.value : null
  const activeAnnouncements = announcements.status === 'fulfilled' ? announcements.value : []

  // Get bucket slug for CosmicBadge
  const bucketSlug = process.env.COSMIC_BUCKET_SLUG as string

  return (
    <>
      <Header siteSettings={settings} />
      
      {/* Active Announcements */}
      {activeAnnouncements && activeAnnouncements.length > 0 && (
        <div className="border-b border-gray-200">
          {activeAnnouncements.map((announcement) => (
            <AnnouncementBanner
              key={announcement.id}
              announcement={announcement}
            />
          ))}
        </div>
      )}

      {/* Hero Section */}
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="container mx-auto px-4 py-12">
          {/* Hero Content */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              {settings?.metadata?.site_name || 'Live Stream'}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {settings?.metadata?.tagline || 
               'Welcome to my personal live streaming platform. Join me for live broadcasts, tutorials, and interactive sessions.'}
            </p>
          </div>

          {/* Stream Player */}
          <div className="mb-16">
            <Suspense fallback={<StreamPlayerSkeleton />}>
              <EnhancedStreamPlayer />
            </Suspense>
          </div>

          {/* Additional Info */}
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  📺 Live Streaming
                </h3>
                <p className="text-gray-600">
                  Join me for live broadcasts where I share insights, tutorials, and answer your questions in real-time. 
                  The stream indicator above will show when I'm live.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  🎯 Interactive Sessions
                </h3>
                <p className="text-gray-600">
                  Each stream is interactive - feel free to ask questions, request topics, or just say hello. 
                  Your engagement makes the streams better for everyone.
                </p>
              </div>
            </div>
            
            {settings?.metadata?.description && (
              <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  About This Stream
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {settings.metadata.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Cosmic Badge */}
      <CosmicBadge bucketSlug={bucketSlug} />
    </>
  )
}