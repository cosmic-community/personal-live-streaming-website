'use client'

import { useState, useEffect, useCallback } from 'react'
import StreamPlayer from './StreamPlayer'
import StreamStatus from './StreamStatus'
import { connectSocket, subscribeToStreamUpdates, unsubscribeFromStreamUpdates, type StreamUpdateData } from '@/lib/socket-client'
import type { Stream } from '@/types'

interface RealTimeStreamPlayerProps {
  initialStream: Stream | null
  fallbackPlaybackId?: string
}

export default function RealTimeStreamPlayer({ 
  initialStream, 
  fallbackPlaybackId = 'NPQ01ZJs9TAkBnsxlfsF2CvNwHXTooFdcxrgGXFEi7cs' 
}: RealTimeStreamPlayerProps) {
  const [streamData, setStreamData] = useState<StreamUpdateData>({
    status: initialStream?.metadata?.status || 'offline',
    playbackId: initialStream?.metadata?.playback_id || fallbackPlaybackId,
    title: initialStream?.title,
    description: initialStream?.metadata?.description,
    slug: initialStream?.slug,
    scheduledDate: initialStream?.metadata?.scheduled_date
  })

  const [isConnected, setIsConnected] = useState(false)
  const [viewerCount, setViewerCount] = useState<number>(0)

  // Handle stream updates from WebSocket
  const handleStreamUpdate = useCallback((data: StreamUpdateData) => {
    console.log('Received stream update:', data)
    
    setStreamData(prevData => ({
      ...prevData,
      ...data,
      // Ensure we keep a playback ID for the player
      playbackId: data.playbackId || prevData.playbackId || fallbackPlaybackId
    }))

    // Auto-play notification when stream goes live
    if (data.status === 'live' && streamData.status !== 'live') {
      // You could add browser notification here
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('🔴 Stream is now live!', {
          body: data.title || 'Your stream has started',
          icon: '/favicon.ico'
        })
      }
    }
  }, [streamData.status, fallbackPlaybackId])

  // Initialize WebSocket connection
  useEffect(() => {
    connectSocket()
    
    // Subscribe to stream updates
    subscribeToStreamUpdates(handleStreamUpdate)
    
    // Check initial stream status
    const checkInitialStatus = async () => {
      try {
        const response = await fetch('/api/stream')
        if (response.ok) {
          const data = await response.json()
          handleStreamUpdate(data)
        }
      } catch (error) {
        console.error('Failed to check initial stream status:', error)
      }
    }

    checkInitialStatus()

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }

    return () => {
      unsubscribeFromStreamUpdates(handleStreamUpdate)
    }
  }, [handleStreamUpdate])

  // Simulate viewer count updates (in real app, this would come from WebSocket)
  useEffect(() => {
    if (streamData.status === 'live') {
      const interval = setInterval(() => {
        setViewerCount(prev => {
          const change = Math.floor(Math.random() * 10) - 5 // Random change -5 to +4
          return Math.max(1, prev + change) // Minimum 1 viewer
        })
      }, 5000)

      // Start with a random viewer count
      setViewerCount(Math.floor(Math.random() * 50) + 10)

      return () => clearInterval(interval)
    } else {
      setViewerCount(0)
    }
  }, [streamData.status])

  const isLive = streamData.status === 'live'
  const playbackId = streamData.playbackId || fallbackPlaybackId

  return (
    <div className="space-y-6">
      {/* Connection Status Indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
          {isConnected ? 'Connected to live updates' : 'Connecting...'}
        </div>
        
        <StreamStatus 
          status={streamData.status}
          scheduledDate={streamData.scheduledDate}
          viewerCount={isLive ? viewerCount : undefined}
        />
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
        {streamData.status === 'offline' && (
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
              <span className="text-sm">You'll be notified when streaming begins!</span>
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
      </div>
    </div>
  )
}