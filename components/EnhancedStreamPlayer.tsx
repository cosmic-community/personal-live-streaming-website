'use client'

import { useState, useEffect } from 'react'
import LiveStreamIndicator from './LiveStreamIndicator'

interface StreamData {
  isLive: boolean
  streamId?: string
  playbackId?: string
  title?: string
  status?: string
}

export default function EnhancedStreamPlayer() {
  const [streamData, setStreamData] = useState<StreamData>({ isLive: false })
  const [showPlayer, setShowPlayer] = useState(false)
  const [playerError, setPlayerError] = useState<string | null>(null)

  const handleStreamUpdate = (newStreamData: StreamData) => {
    setStreamData(newStreamData)
    setPlayerError(null)
    
    // Auto-show player when stream goes live
    if (newStreamData.isLive && newStreamData.playbackId) {
      setShowPlayer(true)
    }
  }

  const handlePlayClick = () => {
    if (streamData.isLive && streamData.playbackId) {
      setShowPlayer(true)
    } else {
      setPlayerError('Stream is not currently live')
    }
  }

  const getMuxPlayerUrl = (playbackId: string) => {
    return `https://player.mux.com/${playbackId}?primary-color=%2329abe2&secondary-color=%23f7fbfc&autoplay=true`
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Stream Status Header */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Personal Live Stream
            </h2>
            <LiveStreamIndicator onStreamUpdate={handleStreamUpdate} />
          </div>
          
          {streamData.isLive && !showPlayer && (
            <button
              onClick={handlePlayClick}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              <span>Watch Live</span>
            </button>
          )}
        </div>
      </div>

      {/* Video Player Area */}
      <div className="relative bg-black rounded-lg overflow-hidden shadow-lg">
        {showPlayer && streamData.isLive && streamData.playbackId ? (
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={getMuxPlayerUrl(streamData.playbackId)}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
              allowFullScreen
              onError={() => setPlayerError('Failed to load video player')}
            />
          </div>
        ) : (
          <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            <div className="text-center space-y-4">
              {streamData.isLive ? (
                <>
                  <div className="w-16 h-16 mx-auto bg-red-600 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold">Stream is Live!</h3>
                  <p className="text-gray-300">Click "Watch Live" to start viewing</p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 mx-auto bg-gray-600 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zM11 8a1 1 0 112 0v4a1 1 0 11-2 0V8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold">Stream Offline</h3>
                  <p className="text-gray-300">The stream will appear here when live</p>
                  <p className="text-sm text-gray-400">Status updates automatically every 30 seconds</p>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {playerError && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-red-800 font-medium">{playerError}</p>
          </div>
        </div>
      )}

      {/* Stream Info */}
      {streamData.isLive && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-3"></div>
            <div>
              <p className="text-green-800 font-semibold">Currently Broadcasting</p>
              {streamData.title && (
                <p className="text-green-700 text-sm">{streamData.title}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}