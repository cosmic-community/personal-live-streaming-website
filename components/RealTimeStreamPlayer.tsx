'use client'

import { useEffect, useState, useRef } from 'react'
import StreamPlayer from './StreamPlayer'
import StreamStatus from './StreamStatus'
import { io, Socket } from 'socket.io-client'

interface RealTimeStreamPlayerProps {
  playbackId: string
  isLive: boolean
  title: string
  description?: string
}

interface StreamData {
  status: 'live' | 'offline' | 'scheduled' | 'archived'
  playbackId: string
  title?: string
  description?: string
  scheduledDate?: string
  viewerCount?: number
  muxStreamId?: string
}

export default function RealTimeStreamPlayer({ 
  playbackId: initialPlaybackId, 
  isLive: initialIsLive, 
  title,
  description 
}: RealTimeStreamPlayerProps) {
  const [streamData, setStreamData] = useState<StreamData>({
    status: initialIsLive ? 'live' : 'offline',
    playbackId: initialPlaybackId,
    title,
    description,
    viewerCount: undefined
  })

  const [isLoading, setIsLoading] = useState(false)
  const socketRef = useRef<Socket | null>(null)
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize real-time updates
  useEffect(() => {
    // Set up Socket.IO connection if available
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL
    if (socketUrl) {
      console.log('Connecting to Socket.IO server:', socketUrl)
      
      socketRef.current = io(socketUrl, {
        transports: ['websocket', 'polling'],
        timeout: 10000,
        reconnectionDelay: 2000,
        reconnectionAttempts: 5
      })

      socketRef.current.on('connect', () => {
        console.log('✅ Connected to real-time updates')
        socketRef.current?.emit('join-stream-room', { playbackId: streamData.playbackId })
      })

      socketRef.current.on('stream-status-update', (data: StreamData) => {
        console.log('📡 Received real-time stream update:', data)
        setStreamData(prev => ({
          ...prev,
          ...data,
          playbackId: data.playbackId || prev.playbackId
        }))
      })

      socketRef.current.on('viewer-count-update', ({ viewerCount }: { viewerCount: number }) => {
        setStreamData(prev => ({
          ...prev,
          viewerCount
        }))
      })

      socketRef.current.on('disconnect', (reason) => {
        console.log('❌ Disconnected from real-time updates:', reason)
      })

      socketRef.current.on('connect_error', (error) => {
        console.log('🔌 Socket connection error (falling back to polling):', error.message)
      })
    }

    // Set up polling as fallback (and primary method if no socket URL)
    const pollStreamStatus = async () => {
      try {
        const response = await fetch('/api/stream/status', {
          cache: 'no-store'
        })
        
        if (response.ok) {
          const data: StreamData = await response.json()
          setStreamData(prev => ({
            ...prev,
            ...data,
            playbackId: data.playbackId || prev.playbackId
          }))
        }
      } catch (error) {
        console.warn('Error polling stream status:', error)
      }
    }

    // Poll every 30 seconds as fallback
    pollIntervalRef.current = setInterval(pollStreamStatus, 30000)
    
    // Initial poll
    pollStreamStatus()

    return () => {
      // Cleanup
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
        pollIntervalRef.current = null
      }
    }
  }, [streamData.playbackId])

  // Manual refresh function
  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/stream/status', {
        cache: 'no-store'
      })
      
      if (response.ok) {
        const data: StreamData = await response.json()
        setStreamData(prev => ({
          ...prev,
          ...data,
          playbackId: data.playbackId || prev.playbackId
        }))
      }
    } catch (error) {
      console.error('Error refreshing stream status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const isStreamLive = streamData.status === 'live'

  return (
    <div className="space-y-6">
      {/* Stream Status and Controls */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <StreamStatus 
            status={streamData.status}
            scheduledDate={streamData.scheduledDate}
            viewerCount={streamData.viewerCount}
          />
          
          <div className="flex items-center gap-3">
            {/* Connection Status */}
            <div className="flex items-center gap-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${
                socketRef.current?.connected ? 'bg-green-500' : 'bg-yellow-500'
              }`}></div>
              <span className="text-gray-300">
                {socketRef.current?.connected ? 'Live Updates' : 'Polling Updates'}
              </span>
            </div>
            
            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-lg transition-colors text-sm"
            >
              <svg 
                className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {isLoading ? 'Updating...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Stream Title and Description */}
        <div className="text-left">
          <h2 className="text-2xl font-bold text-white mb-2">{streamData.title || title}</h2>
          {streamData.description && (
            <p className="text-gray-300">{streamData.description}</p>
          )}
        </div>
      </div>

      {/* Stream Player */}
      <StreamPlayer 
        playbackId={streamData.playbackId}
        isLive={isStreamLive}
        title={streamData.title || title}
        description={streamData.description || description}
      />

      {/* Debug Info (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-black/50 rounded-lg p-4 text-xs text-gray-400 font-mono">
          <div className="mb-2 text-gray-300 font-semibold">Debug Info:</div>
          <div>Status: {streamData.status}</div>
          <div>Playback ID: {streamData.playbackId}</div>
          <div>Socket Connected: {socketRef.current?.connected ? 'Yes' : 'No'}</div>
          <div>Viewer Count: {streamData.viewerCount || 'N/A'}</div>
          {streamData.muxStreamId && <div>Mux Stream ID: {streamData.muxStreamId}</div>}
        </div>
      )}
    </div>
  )
}