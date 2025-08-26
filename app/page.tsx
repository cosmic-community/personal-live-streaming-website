import { getCurrentStream, getActiveAnnouncements, getSiteSettings } from '@/lib/cosmic'
import StreamPlayer from '@/components/StreamPlayer'
import AnnouncementBanner from '@/components/AnnouncementBanner'
import type { Stream, StreamAnnouncement, SiteSettings } from '@/types'

// Hero Section Component
function HeroSection({ siteSettings }: { siteSettings: SiteSettings | null }) {
  const siteName = siteSettings?.metadata?.site_name || siteSettings?.metadata?.site_title || 'Live Stream'
  const tagline = siteSettings?.metadata?.tagline || 'Welcome to our live streaming experience'

  return (
    <div className="text-center py-16 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-5xl font-bold text-white mb-6">
          {siteName}
        </h1>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          {tagline}
        </p>
        <div className="flex justify-center space-x-4">
          <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
            Watch Live
          </button>
          <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
            View Archive
          </button>
        </div>
      </div>
    </div>
  )
}

// About Section Component
function AboutSection({ siteSettings }: { siteSettings: SiteSettings | null }) {
  const description = siteSettings?.metadata?.description || siteSettings?.metadata?.site_description || 'Learn more about our live streaming content and community.'

  return (
    <div className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">About Our Streams</h2>
        <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
          {description}
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="text-3xl mb-4">🎥</div>
            <h3 className="font-semibold text-gray-900 mb-2">High Quality</h3>
            <p className="text-gray-600">Experience crystal clear HD streaming with professional audio quality.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="text-3xl mb-4">👥</div>
            <h3 className="font-semibold text-gray-900 mb-2">Interactive</h3>
            <p className="text-gray-600">Engage with our community through real-time chat and interactions.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="text-3xl mb-4">⏰</div>
            <h3 className="font-semibred text-gray-900 mb-2">Regular Schedule</h3>
            <p className="text-gray-600">Join us for regular streaming sessions with consistent scheduling.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default async function HomePage() {
  // Fetch data concurrently for better performance
  const [currentStream, activeAnnouncements, siteSettings] = await Promise.all([
    getCurrentStream(),
    getActiveAnnouncements(), 
    getSiteSettings()
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Announcement Banners */}
      {activeAnnouncements && activeAnnouncements.length > 0 && (
        <div className="space-y-2">
          {activeAnnouncements.map((announcement) => (
            <AnnouncementBanner 
              key={announcement.id} 
              announcement={announcement}
            />
          ))}
        </div>
      )}

      {/* Hero Section */}
      <HeroSection siteSettings={siteSettings} />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Stream Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <StreamPlayer stream={currentStream} />
              
              {/* Stream Info */}
              {currentStream && (
                <div className="p-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {currentStream.title}
                  </h1>
                  {currentStream.metadata?.description && (
                    <p className="text-gray-700 mb-4">
                      {currentStream.metadata.description}
                    </p>
                  )}
                  
                  {/* Stream Stats */}
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    {currentStream.metadata?.viewer_count && (
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                        {currentStream.metadata.viewer_count} viewers
                      </div>
                    )}
                    {currentStream.metadata?.scheduled_date && (
                      <div>
                        Started: {new Date(currentStream.metadata.scheduled_date).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* About Section in Sidebar */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                {siteSettings?.metadata?.description || siteSettings?.metadata?.site_description || 'Welcome to our live streaming community. Join us for engaging content and interactive experiences.'}
              </p>
            </div>

            {/* Social Links */}
            {siteSettings?.metadata?.social_links && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow Us</h3>
                <div className="space-y-3">
                  {siteSettings.metadata.social_links.youtube && (
                    <a 
                      href={siteSettings.metadata.social_links.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-700 hover:text-red-600 transition-colors"
                    >
                      <span className="mr-3">📺</span>
                      YouTube
                    </a>
                  )}
                  {siteSettings.metadata.social_links.twitch && (
                    <a 
                      href={siteSettings.metadata.social_links.twitch}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-700 hover:text-purple-600 transition-colors"
                    >
                      <span className="mr-3">🎮</span>
                      Twitch
                    </a>
                  )}
                  {siteSettings.metadata.social_links.twitter && (
                    <a 
                      href={siteSettings.metadata.social_links.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-700 hover:text-blue-400 transition-colors"
                    >
                      <span className="mr-3">🐦</span>
                      Twitter
                    </a>
                  )}
                  {siteSettings.metadata.social_links.discord && (
                    <a 
                      href={siteSettings.metadata.social_links.discord}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-700 hover:text-indigo-600 transition-colors"
                    >
                      <span className="mr-3">💬</span>
                      Discord
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Stream Schedule */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monday</span>
                  <span className="text-gray-900">8:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Wednesday</span>
                  <span className="text-gray-900">8:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Friday</span>
                  <span className="text-gray-900">8:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sunday</span>
                  <span className="text-gray-900">3:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <AboutSection siteSettings={siteSettings} />
    </div>
  )
}