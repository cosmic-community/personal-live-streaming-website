import { getSiteSettings } from '@/lib/cosmic'

export const metadata = {
  title: 'About - Personal Live Streaming',
  description: 'Learn more about the streamer and what to expect'
}

export default async function AboutPage() {
  const siteSettings = await getSiteSettings()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          About {siteSettings?.metadata?.site_title || 'This Stream'}
        </h1>
        <p className="text-xl text-gray-600">
          Welcome to my personal live streaming platform
        </p>
      </div>

      <div className="prose prose-lg mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What You Can Expect</h2>
          <p className="text-gray-600 mb-6">
            This is my personal live streaming website where I share content, interact with viewers, 
            and create engaging experiences. All streams are powered by Mux Video for the highest 
            quality viewing experience across all devices.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Stream Quality</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• Adaptive bitrate streaming</li>
                <li>• Multiple quality options</li>
                <li>• Low-latency delivery</li>
                <li>• Mobile-optimized playback</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Features</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• Live stream notifications</li>
                <li>• Stream archive access</li>
                <li>• Responsive design</li>
                <li>• Cross-platform compatibility</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Stay Updated</h2>
          <p className="text-gray-600 mb-6">
            Make sure you don't miss any live streams! Here's how to stay in the loop:
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-sm font-bold">1</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Bookmark This Page</h3>
                <p className="text-gray-600">Save this site and check back regularly for live streams</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-sm font-bold">2</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Follow Social Media</h3>
                <p className="text-gray-600">Get notifications about upcoming streams on social platforms</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-sm font-bold">3</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Check the Archive</h3>
                <p className="text-gray-600">Browse past streams to catch up on content you missed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}