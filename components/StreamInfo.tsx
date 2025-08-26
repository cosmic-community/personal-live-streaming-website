import { Stream } from '@/types'

interface StreamInfoProps {
  stream: Stream
}

export default function StreamInfo({ stream }: StreamInfoProps) {
  const streamDate = stream.metadata?.scheduled_date ? 
    new Date(stream.metadata.scheduled_date) : 
    new Date(stream.created_at)

  const isLive = stream.metadata?.status === 'live'
  const isScheduled = stream.metadata?.status === 'scheduled'
  
  return (
    <div className="space-y-6">
      {/* Stream Status Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Stream Info</h3>
        
        <div className="space-y-4">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Status</span>
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-2 ${
                isLive ? 'bg-red-500' : 
                isScheduled ? 'bg-yellow-500' : 
                'bg-gray-400'
              }`} />
              <span className={`font-medium ${
                isLive ? 'text-red-600' : 
                isScheduled ? 'text-yellow-600' : 
                'text-gray-600'
              }`}>
                {stream.metadata?.status ? 
                  stream.metadata.status.charAt(0).toUpperCase() + stream.metadata.status.slice(1) : 
                  'Offline'
                }
              </span>
            </div>
          </div>

          {/* Category */}
          {stream.metadata?.category && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Category</span>
              <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                {stream.metadata.category}
              </span>
            </div>
          )}

          {/* Date */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600">
              {isScheduled ? 'Scheduled' : 'Date'}
            </span>
            <span className="text-gray-900 font-medium">
              {streamDate.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>

          {/* Time */}
          {stream.metadata?.scheduled_date && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Time</span>
              <span className="text-gray-900 font-medium">
                {streamDate.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  timeZoneName: 'short'
                })}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Stream Thumbnail */}
      {stream.metadata?.thumbnail?.imgix_url && (
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
          <div className="aspect-video rounded-lg overflow-hidden">
            <img
              src={`${stream.metadata.thumbnail.imgix_url}?w=400&h=300&fit=crop&auto=format,compress`}
              alt={stream.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Tags */}
      {stream.metadata?.tags && stream.metadata.tags.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {stream.metadata.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Additional Info */}
      <div className="bg-gray-50 rounded-lg p-6 border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            HD Quality Stream
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Mobile Friendly
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            Interactive Chat
          </div>
        </div>
      </div>
    </div>
  )
}