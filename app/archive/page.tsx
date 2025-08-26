import { getAllStreams } from '@/lib/cosmic'
import Link from 'next/link'
import type { Stream } from '@/types'

export const metadata = {
  title: 'Stream Archive - Personal Live Streaming',
  description: 'Browse past live streams and recordings'
}

export default async function ArchivePage() {
  const streams = await getAllStreams()
  const archivedStreams = streams.filter(stream => 
    stream.metadata?.status === 'archived' || 
    stream.metadata?.status === 'offline'
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Stream Archive
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Browse past live streams and recordings. Relive the highlights and catch up on content you might have missed.
        </p>
      </div>

      {archivedStreams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {archivedStreams.map((stream) => (
            <div key={stream.id} className="stream-info-card group hover:scale-105 transition-transform duration-300">
              {/* Thumbnail */}
              <div className="aspect-video mb-4 bg-gray-900 rounded-lg overflow-hidden">
                {stream.metadata?.thumbnail ? (
                  <img
                    src={`${stream.metadata.thumbnail.imgix_url}?w=400&h=225&fit=crop&auto=format,compress`}
                    alt={stream.title}
                    width="400"
                    height="225"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                
                {/* Play overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {stream.title}
                </h3>
                
                {stream.metadata?.description && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {stream.metadata.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>
                    {formatDate(stream.metadata?.scheduled_date || stream.created_at)}
                  </span>
                  {stream.metadata?.duration && (
                    <span>
                      {formatDuration(stream.metadata.duration)}
                    </span>
                  )}
                </div>

                {/* Tags */}
                {stream.metadata?.tags && stream.metadata.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {stream.metadata.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700"
                      >
                        #{tag}
                      </span>
                    ))}
                    {stream.metadata.tags.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{stream.metadata.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* View Stream Link */}
              <Link 
                href={`/stream/${stream.slug}`}
                className="absolute inset-0 z-10"
                aria-label={`Watch ${stream.title}`}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Archived Streams</h3>
            <p className="text-gray-600">
              Past streams will appear here once they've been archived. Check back after the first live session!
            </p>
          </div>
        </div>
      )}
    </div>
  )
}