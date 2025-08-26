import { getCurrentStream, getActiveAnnouncements, getSiteSettings } from '@/lib/cosmic'
import StreamPlayer from '@/components/StreamPlayer'
import StreamStatus from '@/components/StreamStatus'
import AnnouncementBanner from '@/components/AnnouncementBanner'
import StreamInfo from '@/components/StreamInfo'

export default async function HomePage() {
  // Add error boundaries for each API call
  let currentStream = null;
  let announcements: any[] = [];
  let siteSettings = null;

  try {
    [currentStream, announcements, siteSettings] = await Promise.allSettled([
      getCurrentStream(),
      getActiveAnnouncements(),
      getSiteSettings()
    ]).then(results => [
      results[0].status === 'fulfilled' ? results[0].value : null,
      results[1].status === 'fulfilled' ? results[1].value : [],
      results[2].status === 'fulfilled' ? results[2].value : null,
    ]);
  } catch (error) {
    console.error('Error fetching page data:', error);
    // Continue with null/empty fallbacks
  }

  const isLive = currentStream?.metadata?.status === 'live'
  const playbackId = currentStream?.metadata?.playback_id || 'NPQ01ZJs9TAkBnsxlfsF2CvNwHXTooFdcxrgGXFEi7cs'

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
            
            {/* Stream Status */}
            <div className="flex justify-center mb-8">
              <StreamStatus 
                status={currentStream?.metadata?.status || 'offline'}
                scheduledDate={currentStream?.metadata?.scheduled_date}
              />
            </div>
          </div>

          {/* Video Player */}
          <div className="mb-12">
            <StreamPlayer 
              playbackId={playbackId}
              isLive={isLive}
              title={currentStream?.title}
              description={currentStream?.metadata?.description}
            />
          </div>

          {/* Stream Information */}
          {currentStream && (
            <StreamInfo stream={currentStream} />
          )}

          {/* Offline Message */}
          {!currentStream && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Stream</h3>
                <p className="text-gray-600">
                  {siteSettings?.metadata?.offline_message || 'I\'m not streaming right now, but check back soon for exciting content!'}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}