import { getCurrentStream, getActiveAnnouncements, getSiteSettings } from '@/lib/cosmic'
import RealTimeStreamPlayer from '@/components/RealTimeStreamPlayer'
import AnnouncementBanner from '@/components/AnnouncementBanner'
import type { Stream, StreamAnnouncement, SiteSettings } from '@/types'

export default async function HomePage() {
  // Add error boundaries for each API call with proper typing
  let currentStream: Stream | null = null;
  let announcements: StreamAnnouncement[] = [];
  let siteSettings: SiteSettings | null = null;

  try {
    const results = await Promise.allSettled([
      getCurrentStream(),
      getActiveAnnouncements(),
      getSiteSettings()
    ]);

    // Type-safe result extraction with proper null checks
    if (results[0].status === 'fulfilled' && results[0].value) {
      currentStream = results[0].value;
    }
    
    if (results[1].status === 'fulfilled' && Array.isArray(results[1].value)) {
      announcements = results[1].value;
    }
    
    if (results[2].status === 'fulfilled' && results[2].value) {
      siteSettings = results[2].value;
    }
  } catch (error) {
    console.error('Error fetching page data:', error);
    // Continue with null/empty fallbacks
  }

  return (
    <div className="animate-fade-in">
      {/* Announcement Banner */}
      {announcements && announcements.length > 0 && (
        <AnnouncementBanner announcements={announcements} />
      )}

      {/* Hero Section */}
      <section className="pt-8 pb-12">
        <div className="stream-container">
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              {siteSettings?.metadata?.site_title || 'Live Streaming'}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
              {siteSettings?.metadata?.site_description || 'Welcome to my personal live streaming platform. Join me for exciting content and interactive experiences.'}
            </p>
          </div>

          {/* Real-time Stream Player */}
          <RealTimeStreamPlayer 
            initialStream={currentStream}
            fallbackPlaybackId="NPQ01ZJs9TAkBnsxlfsF2CvNwHXTooFdcxrgGXFEi7cs"
          />

          {/* Offline Message Enhancement */}
          {!currentStream && (
            <div className="text-center py-12 mt-8">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-Time Stream Monitor</h3>
                <p className="text-gray-600">
                  {siteSettings?.metadata?.offline_message || 'The page will automatically update when a stream goes live. No refresh needed!'}
                </p>
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Monitoring for live streams...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )