'use client'

interface StreamPlayerProps {
  playbackId?: string
  isLive?: boolean
  title?: string
  description?: string
  stream?: any
}

export default function StreamPlayer({ 
  playbackId = 'NPQ01ZJs9TAkBnsxlfsF2CvNwHXTooFdcxrgGXFEi7cs',
  isLive = false,
  title = 'Live Stream',
  description,
  stream
}: StreamPlayerProps) {
  // Use stream data if provided, otherwise use individual props
  const actualPlaybackId = stream?.metadata?.playback_id || playbackId
  const actualIsLive = stream?.metadata?.status === 'live' || isLive
  const actualTitle = stream?.title || title
  const actualDescription = stream?.metadata?.description || description

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl">
        {/* Video Player */}
        <div className="relative aspect-video">
          {actualPlaybackId ? (
            <iframe
              src="https://player.mux.com/NPQ01ZJs9TAkBnsxlfsF2CvNwHXTooFdcxrgGXFEi7cs?primary-color=%2329abe2&secondary-color=%23f7fbfc"
              style={{ width: '100%', border: 'none' }}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
              allowFullScreen
              title={actualTitle}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-700 flex items-center justify-center">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Stream Offline</h3>
                <p className="text-gray-400">The stream will start soon</p>
              </div>
            </div>
          )}

          {/* Live Indicator */}
          {actualIsLive && (
            <div className="absolute top-4 left-4 z-10">
              <div className="flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                LIVE
              </div>
            </div>
          )}

          {/* Stream Controls Overlay */}
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <div className="bg-black/50 backdrop-blur-md rounded-lg p-3">
              <div className="flex items-center justify-between text-white text-sm">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      actualIsLive ? 'bg-red-500 animate-pulse' : 'bg-gray-500'
                    }`}></div>
                    <span className="font-medium">
                      {actualIsLive ? 'LIVE' : 'OFFLINE'}
                    </span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-medium">{actualTitle}</div>
                  {actualDescription && (
                    <div className="text-gray-300 text-xs mt-1 max-w-xs truncate">
                      {actualDescription}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stream Info Bar */}
        <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-white font-semibold text-lg mb-1">{actualTitle}</h3>
              {actualDescription && (
                <p className="text-gray-300 text-sm line-clamp-2">{actualDescription}</p>
              )}
            </div>
            
            <div className="flex items-center gap-4 ml-4">
              {actualIsLive && (
                <div className="text-center">
                  <div className="text-white font-semibold">●</div>
                  <div className="text-gray-300 text-xs">Recording</div>
                </div>
              )}
              
              <div className="text-center">
                <div className="text-white font-semibold">
                  {actualIsLive ? 'ON AIR' : 'OFFLINE'}
                </div>
                <div className="text-gray-300 text-xs">Status</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stream Information */}
      {actualDescription && (
        <div className="mt-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
          <h4 className="text-white font-semibold mb-3">About this stream</h4>
          <p className="text-gray-300 leading-relaxed">{actualDescription}</p>
        </div>
      )}
    </div>
  )
}