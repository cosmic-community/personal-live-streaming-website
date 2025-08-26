import Link from 'next/link'
import { getAllStreams } from '@/lib/cosmic'
import type { Stream } from '@/types'

export default async function ArchivePage() {
  const streams = await getAllStreams()

  // Filter archived and offline streams
  const archivedStreams = streams.filter(stream => 
    stream.metadata?.status === 'archived' || 
    (stream.metadata?.status === 'offline' && stream.metadata?.recording_url)
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Stream Archive
          </h1>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
            Watch previous live streams and recordings
          </p>
        </div>

        {archivedStreams.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2">No Archived Streams</h3>
            <p className="text-gray-400">Check back later for recorded streams!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {archivedStreams.map((stream: Stream) => {
              // Get thumbnail from metadata or fallback
              const thumbnailUrl = stream.metadata?.thumbnail?.imgix_url || stream.thumbnail;
              const optimizedThumbnail = thumbnailUrl ? `${thumbnailUrl}?w=600&h=400&fit=crop&auto=format,compress` : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop&auto=format,compress';
              
              return (
                <Link href={`/stream/${stream.slug}`} key={stream.id}>
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden hover:scale-105 transition-all duration-300 group">
                    <div className="aspect-video relative overflow-hidden">
                      <img 
                        src={optimizedThumbnail}
                        alt={stream.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                          <span className="text-white text-sm font-medium">ARCHIVED</span>
                        </div>
                      </div>
                      <div className="absolute top-4 right-4">
                        <div className="bg-black/50 backdrop-blur-sm rounded-full p-2">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-200 transition-colors">
                        {stream.title}
                      </h3>
                      {stream.metadata?.description && (
                        <p className="text-gray-300 mb-4 line-clamp-2">
                          {stream.metadata.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <span>
                          {stream.metadata?.scheduled_date 
                            ? new Date(stream.metadata.scheduled_date).toLocaleDateString()
                            : new Date(stream.created_at).toLocaleDateString()
                          }
                        </span>
                        {stream.metadata?.category && (
                          <span className="bg-purple-600/20 text-purple-200 px-3 py-1 rounded-full">
                            {stream.metadata.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="text-center mt-12">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-full text-lg font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Live Stream
          </Link>
        </div>
      </div>
    </div>
  )
}