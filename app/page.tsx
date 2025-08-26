import { getCurrentStream, getActiveAnnouncements, getSiteSettings } from '@/lib/cosmic'
import StreamPlayer from '@/components/StreamPlayer'
import AnnouncementBanner from '@/components/AnnouncementBanner'
import CosmicBadge from '@/components/CosmicBadge'

export default async function Home() {
  const [stream, announcements, settings] = await Promise.all([
    getCurrentStream(),
    getActiveAnnouncements(),
    getSiteSettings()
  ])

  const siteName = settings?.metadata?.site_name || settings?.metadata?.site_title || 'Live Stream'
  const tagline = settings?.metadata?.tagline || 'Welcome to our live stream'
  const bucketSlug = process.env.COSMIC_BUCKET_SLUG as string

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      {/* Announcements */}
      {announcements && announcements.length > 0 && (
        <div className="space-y-2">
          {announcements.map(announcement => (
            <AnnouncementBanner 
              key={announcement.id} 
              announcements={[announcement]} 
            />
          ))}
        </div>
      )}

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              {siteName}
            </h1>
            <p className="text-xl md:text-2xl text-purple-200 max-w-3xl mx-auto mb-8">
              {tagline}
            </p>
            {settings?.metadata?.description && (
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                {settings.metadata.description}
              </p>
            )}
          </div>

          {/* Stream Status and Info */}
          <div className="max-w-4xl mx-auto mb-8">
            {stream && (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 mb-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-2">{stream.title}</h2>
                    {stream.metadata?.description && (
                      <p className="text-gray-300">{stream.metadata.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        stream.metadata?.status === 'live' ? 'bg-red-500 animate-pulse' : 'bg-gray-500'
                      }`}></div>
                      <span className="text-white font-medium">
                        {stream.metadata?.status === 'live' ? 'LIVE' : 'OFFLINE'}
                      </span>
                    </div>
                    {stream.metadata?.status === 'live' && stream.metadata?.viewer_count && (
                      <div className="flex items-center gap-1 text-gray-300">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                        </svg>
                        <span>{stream.metadata.viewer_count?.toLocaleString() || 0} viewers</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main Stream Player */}
          <div className="max-w-6xl mx-auto">
            <StreamPlayer 
              stream={stream}
              description={stream?.metadata?.description}
            />
          </div>
        </div>
      </div>

      {/* About Section */}
      {settings?.metadata?.description && (
        <section className="py-16 bg-black/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-8">About</h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              {settings.metadata.description}
            </p>
          </div>
        </section>
      )}

      {/* Social Links */}
      {settings?.metadata?.social_links && Object.values(settings.metadata.social_links).some(link => link) && (
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-8">Follow Us</h2>
            <div className="flex justify-center gap-6 flex-wrap">
              {settings.metadata.social_links.twitch && (
                <a 
                  href={settings.metadata.social_links.twitch} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2.149 0L.537 4.119v15.581h5.731V24l3.224-4.3h2.973l5.731-5.731V0H2.149zm15.326 12.873L14.6 15.746h-3.224l-2.973 2.973v-2.973H2.672V2.149h14.803v10.724z"/>
                    <path d="M13.061 4.298v5.731h-1.791V4.298h1.791zm-4.298 0v5.731H7.02V4.298h1.743z"/>
                  </svg>
                  Twitch
                </a>
              )}
              {settings.metadata.social_links.youtube && (
                <a 
                  href={settings.metadata.social_links.youtube} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a2.901 2.901 0 00-2.045-2.051C19.609 3.745 12 3.745 12 3.745s-7.609 0-9.453.39A2.901 2.901 0 00.502 6.186C.112 8.03.112 12 .112 12s0 3.97.39 5.814a2.901 2.901 0 002.045 2.051C4.391 20.255 12 20.255 12 20.255s7.609 0 9.453-.39a2.901 2.901 0 002.045-2.051c.39-1.844.39-5.814.39-5.814s0-3.97-.39-5.814zM9.748 15.568V8.432L15.738 12l-5.99 3.568z"/>
                  </svg>
                  YouTube
                </a>
              )}
              {settings.metadata.social_links.twitter && (
                <a 
                  href={settings.metadata.social_links.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  Twitter
                </a>
              )}
              {settings.metadata.social_links.discord && (
                <a 
                  href={settings.metadata.social_links.discord} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                  Discord
                </a>
              )}
              {settings.metadata.social_links.instagram && (
                <a 
                  href={settings.metadata.social_links.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.987 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.542-3.293-1.405-.845-.862-1.293-2.013-1.293-3.31s.448-2.448 1.293-3.31c.845-.863 1.996-1.405 3.293-1.405s2.448.542 3.293 1.405c.845.862 1.293 2.013 1.293 3.31s-.448 2.448-1.293 3.31c-.845.863-1.996 1.405-3.293 1.405zm6.988 0c-1.297 0-2.448-.542-3.293-1.405-.845-.862-1.293-2.013-1.293-3.31s.448-2.448 1.293-3.31c.845-.863 1.996-1.405 3.293-1.405s2.448.542 3.293 1.405c.845.862 1.293 2.013 1.293 3.31s-.448 2.448-1.293 3.31c-.845.863-1.996 1.405-3.293 1.405z"/>
                  </svg>
                  Instagram
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      <CosmicBadge bucketSlug={bucketSlug} />
    </main>
  )
}