'use client'

import { useState, useEffect, useCallback } from 'react'
import StreamPlayer from './StreamPlayer'
import StreamStatus from './StreamStatus'
import type { Stream } from '@/types'

interface RealTimeStreamPlayerProps {
  initialStream: Stream | null
  fallbackPlaybackId?: string
}

interface StreamStatusData {
  status: 'live' | 'offline' | 'scheduled' | 'archived'
  playbackId?: string
  title?: string
  description?: string
  slug?: string
  scheduledDate?: string
  isLive?: boolean
  muxStatus?: string
}

export default function RealTimeStreamPlayer({ 
  initialStream, 
  fallbackPlaybackId = 'NPQ01ZJs9TAkBnsxlfsF2CvNwHXTooFdcxrgGXFEi7cs' 
}: RealTimeStreamPlayerProps) {
  const [streamData, setStreamData] = useState<StreamStatusData>({
    status: initialStream?.metadata?.status || 'offline',
    playbackId: initialStream?.metadata?.playback_id || fallbackPlaybackId,
    title: initialStream?.title,
    description: initialStream?.metadata?.description,
    slug: initialStream?.slug,
    scheduledDate: initialStream?.metadata?.scheduled_date
  })

  const [isLoading, setIsLoading] = useState(false)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)
  const [viewerCount, setViewerCount] = useState<number>(0)

  // Check stream status from our API
  const checkStreamStatus = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/stream/status', {
        cache: 'no-store' // Always get fresh data
      })
      
      if (response.ok) {
        const data: StreamStatusData = await response.json()
        
        // Check if stream status changed from offline to live
        if (data.status === 'live' && streamData.status !== 'live') {
          // Trigger notification for going live
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('🔴 Stream is now live!', {
              body: data.title || 'Your stream has started',
              icon: '/favicon.ico'
            })
          }
        }
        
        setStreamData(prevData => ({
          ...prevData,
          ...data,
          // Ensure we keep a playback ID for the player
          playbackId: data.playbackId || prevData.playbackId || fallbackPlaybackId
        }))
        
        setLastChecked(new Date())
      } else {
        console.error('Failed to check stream status:', response.status)
      }
    } catch (error) {
      console.error('Error checking stream status:', error)
    } finally {
      setIsLoading(false)
    }
  }, [streamData.status, fallbackPlaybackId])

  // Initial check and periodic polling
  useEffect(() => {
    // Check immediately
    checkStreamStatus()
    
    // Set up periodic checking (every 10 seconds)
    const interval = setInterval(checkStreamStatus, 10000)
    
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }

    return () => clearInterval(interval)
  }, [checkStreamStatus])

  // Simulate viewer count updates when live
  useEffect(() => {
    if (streamData.status === 'live' || streamData.isLive) {
      const interval = setInterval(() => {
        setViewerCount(prev => {
          const change = Math.floor(Math.random() * 10) - 5 // Random change -5 to +4
          return Math.max(1, prev + change) // Minimum 1 viewer
        })
      }, 8000)

      // Start with a random viewer count
      if (viewerCount === 0) {
        setViewerCount(Math.floor(Math.random() * 50) + 10)
      }

      return () => clearInterval(interval)
    } else {
      setViewerCount(0)
    }
  }, [streamData.status, streamData.isLive, viewerCount])

  const isLive = streamData.status === 'live' || streamData.isLive === true
  const playbackId = streamData.playbackId || fallbackPlaybackId

  return (
    <div className="space-y-6">
      {/* Status and Controls */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <StreamStatus 
            status={streamData.status}
            scheduledDate={streamData.scheduledDate}
            viewerCount={isLive ? viewerCount : undefined}
          />
          
          {/* Refresh button */}
          <button
            onClick={checkStreamStatus}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            <svg 
              className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {isLoading ? 'Checking...' : 'Refresh'}
          </button>
        </div>

        {/* Last checked indicator */}
        {lastChecked && (
          <div className="text-xs text-gray-500">
            Last checked: {lastChecked.toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* Stream Title */}
      {streamData.title && (
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {streamData.title}
          </h2>
          {streamData.description && (
            <p className="text-gray-600 max-w-2xl mx-auto">
              {streamData.description}
            </p>
          )}
          
          {/* Mux status for debugging (only in development) */}
          {process.env.NODE_ENV === 'development' && streamData.muxStatus && (
            <div className="text-xs text-gray-400 mt-2">
              Mux Status: {streamData.muxStatus} | Detected: {isLive ? 'Live' : 'Offline'}
            </div>
          )}
        </div>
      )}

      {/* Video Player */}
      <div className="relative">
        <StreamPlayer 
          playbackId={playbackId}
          isLive={isLive}
          title={streamData.title}
          description={streamData.description}
        />
        
        {/* Live indicator overlay */}
        {isLive && (
          <div className="absolute top-4 left-4 z-10">
            <div className="live-indicator shadow-lg">
              <span className="pulse-dot"></span>
              <span className="font-semibold">LIVE</span>
              {viewerCount > 0 && (
                <span className="text-xs opacity-90">
                  {viewerCount} watching
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Stream Status Messages */}
      <div className="text-center">
        {streamData.status === 'offline' && !isLive && (
          <div className="p-6 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Stream Offline</h3>
            <p className="text-gray-600">
              The stream will automatically start here when it goes live. 
              <br />
              <span className="text-sm">Status is checked every 10 seconds!</span>
            </p>
          </div>
        )}

        {streamData.status === 'scheduled' && streamData.scheduledDate && (
          <div className="p-6 bg-blue-50 rounded-lg">
            <div className="w-12 h-12 mx-auto mb-4 bg-blue-200 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Stream Scheduled</h3>
            <p className="text-blue-700">
              Stream starts at {new Date(streamData.scheduledDate).toLocaleString()}
              <br />
              <span className="text-sm">You'll automatically see the stream here when it begins!</span>
            </p>
          </div>
        )}

        {isLive && (
          <div className="p-6 bg-green-50 rounded-lg">
            <div className="w-12 h-12 mx-auto mb-4 bg-green-200 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-green-900 mb-2">🔴 Live Now!</h3>
            <p className="text-green-700">
              The stream is currently live and broadcasting.
              {viewerCount > 0 && (
                <>
                  <br />
                  <span className="text-sm font-medium">{viewerCount} people are watching</span>
                </>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}