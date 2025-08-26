import type { StreamPlayerProps } from '@/types'

export default function StreamPlayer({ 
  playbackId, 
  isLive, 
  title, 
  description 
}: StreamPlayerProps) {
  return (
    <div className="video-wrapper">
      <iframe
        src={`https://player.mux.com/${playbackId}?primary-color=%2329abe2&secondary-color=%23f7fbfc`}
        style={{ width: '100%', height: '100%', border: 'none' }}
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
        allowFullScreen
        title={title || 'Live Stream'}
      />
      
      {/* Overlay for non-live content */}
      {!isLive && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-16 h-16 mx-auto mb-4 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Stream Offline</h3>
            <p className="text-gray-300">The stream will appear here when live</p>
          </div>
        </div>
      )}
    </div>
  )
}