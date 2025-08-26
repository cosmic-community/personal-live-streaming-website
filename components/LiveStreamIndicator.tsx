'use client'

import { useState, useEffect } from 'react'

interface LiveStreamData {
  isLive: boolean
  streamId?: string
  playbackId?: string
  title?: string
  status?: string
}

interface LiveStreamIndicatorProps {
  onStreamUpdate?: (streamData: LiveStreamData) => void
  pollInterval?: number
}

export default function LiveStreamIndicator({ 
  onStreamUpdate, 
  pollInterval = 30000 
}: LiveStreamIndicatorProps) {
  const [isLive, setIsLive] = useState(false)
  const [streamData, setStreamData] = useState<LiveStreamData>({ isLive: false })
  const [isLoading, setIsLoading] = useState(true)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  const checkStreamStatus = async () => {
    try {
      const response = await fetch('/api/mux/streams')
      
      if (!response.ok) {
        throw new Error('Failed to fetch stream status')
      }

      const data = await response.json()
      const hasLiveStreams = data.activeLiveStreams > 0
      
      let currentStreamData: LiveStreamData = {
        isLive: hasLiveStreams
      }

      if (hasLiveStreams && data.liveStreams.length > 0) {
        const liveStream = data.liveStreams[0]
        currentStreamData = {
          isLive: true,
          streamId: liveStream.id,
          playbackId: liveStream.playback_ids?.[0]?.id,
          title: liveStream.created_at ? `Live Stream ${new Date(liveStream.created_at).toLocaleDateString()}` : 'Live Stream',
          status: liveStream.status
        }
      }

      setStreamData(currentStreamData)
      setIsLive(hasLiveStreams)
      setLastChecked(new Date())
      
      // Notify parent component
      if (onStreamUpdate) {
        onStreamUpdate(currentStreamData)
      }

    } catch (error) {
      console.error('Error checking stream status:', error)
      setStreamData({ isLive: false })
      setIsLive(false)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Initial check
    checkStreamStatus()

    // Set up polling interval
    const interval = setInterval(checkStreamStatus, pollInterval)

    return () => clearInterval(interval)
  }, [pollInterval, onStreamUpdate])

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 text-gray-600">
        <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse"></div>
        <span className="text-sm">Checking stream status...</span>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${
          isLive 
            ? 'bg-red-500 animate-pulse' 
            : 'bg-gray-400'
        }`}></div>
        <span className={`font-medium ${
          isLive 
            ? 'text-red-600' 
            : 'text-gray-600'
        }`}>
          {isLive ? 'LIVE' : 'OFFLINE'}
        </span>
      </div>
      
      {lastChecked && (
        <span className="text-xs text-gray-500">
          Updated {lastChecked.toLocaleTimeString()}
        </span>
      )}
      
      {isLive && streamData.title && (
        <span className="text-sm text-gray-700 font-medium">
          {streamData.title}
        </span>
      )}
    </div>
  )
}