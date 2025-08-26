'use client'

import { useState, useEffect } from 'react'
import type { Stream } from '@/types'

interface StreamInfoProps {
  stream: Stream | null
  showViewerCount?: boolean
  compact?: boolean
}

export default function StreamInfo({ stream, showViewerCount = true, compact = false }: StreamInfoProps) {
  const [viewerCount, setViewerCount] = useState<number>(0)
  const [isLive, setIsLive] = useState<boolean>(false)

  useEffect(() => {
    if (stream?.metadata?.status === 'live') {
      setIsLive(true)
      setViewerCount(stream.metadata?.viewer_count || 0)

      // Optional: Set up real-time viewer count updates
      const interval = setInterval(() => {
        // Here you could fetch updated viewer count from your API
        // For now, we'll just use the static count from stream metadata
        if (stream.metadata?.viewer_count) {
          setViewerCount(stream.metadata.viewer_count)
        }
      }, 30000) // Update every 30 seconds

      return () => clearInterval(interval)
    } else {
      setIsLive(false)
      setViewerCount(0)
    }
  }, [stream])

  if (!stream) {
    return (
      <div className={`bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 ${compact ? 'text-center' : ''}`}>
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No Stream Available</h3>
          <p className="text-gray-400">Check back soon for upcoming live streams!</p>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'Date unavailable'
    }
  }

  // Get thumbnail from metadata or fallback
  const thumbnailUrl = stream.metadata?.thumbnail?.imgix_url || stream.thumbnail;
  const optimizedThumbnail = thumbnailUrl ? `${thumbnailUrl}?w=400&h=300&fit=crop&auto=format,compress` : null;

  return (
    <div className={`bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 ${compact ? '' : 'space-y-6'}`}>
      {/* Stream Thumbnail (if available and not compact) */}
      {!compact && optimizedThumbnail && (
        <div className="aspect-video relative overflow-hidden rounded-lg">
          <img 
            src={optimizedThumbnail}
            alt={stream.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  isLive ? 'bg-red-500 animate-pulse' : 'bg-gray-500'
                }`}></div>
                <span className="text-white text-sm font-medium">
                  {isLive ? 'LIVE' : stream.metadata?.status?.toUpperCase() || 'OFFLINE'}
                </span>
              </div>
              {isLive && showViewerCount && (
                <div className="flex items-center gap-1 text-white">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-sm">{viewerCount.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stream Details */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h2 className={`font-bold text-white mb-2 ${compact ? 'text-lg' : 'text-2xl'}`}>
              {stream.title}
            </h2>
            {stream.metadata?.description && (
              <p className={`text-gray-300 ${compact ? 'text-sm line-clamp-2' : 'leading-relaxed'}`}>
                {stream.metadata.description}
              </p>
            )}
          </div>
          
          {compact && (
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  isLive ? 'bg-red-500 animate-pulse' : 'bg-gray-500'
                }`}></div>
                <span className="text-white text-sm font-medium">
                  {isLive ? 'LIVE' : stream.metadata?.status?.toUpperCase() || 'OFFLINE'}
                </span>
              </div>
              {isLive && showViewerCount && (
                <div className="flex items-center gap-1 text-gray-300">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-sm">{viewerCount.toLocaleString()}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Stream Metadata */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-400">
          {stream.metadata?.scheduled_date && (
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>
                {stream.metadata.status === 'scheduled' ? 'Scheduled for ' : 'Streamed on '}
                {formatDate(stream.metadata.scheduled_date)}
              </span>
            </div>
          )}
          
          {stream.metadata?.category && (
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span className="bg-purple-600/20 text-purple-200 px-2 py-1 rounded-full">
                {stream.metadata.category}
              </span>
            </div>
          )}

          {!compact && isLive && showViewerCount && (
            <div className="flex items-center gap-1 text-white">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
              </svg>
              <span className="font-medium">{viewerCount.toLocaleString()} viewers</span>
            </div>
          )}
        </div>

        {/* Stream Tags */}
        {stream.metadata?.tags && stream.metadata.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {stream.metadata.tags.map((tag, index) => (
              <span 
                key={index}
                className="bg-indigo-600/20 text-indigo-200 px-3 py-1 rounded-full text-xs"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}