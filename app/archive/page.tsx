import { getAllStreams } from '@/lib/cosmic'
import { Stream } from '@/types'

export default async function ArchivePage() {
  const streams = await getAllStreams()

  // Filter to show only archived or past streams
  const archivedStreams = streams.filter(stream => 
    stream.metadata?.status === 'archived' || 
    stream.metadata?.status === 'offline'
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Stream Archive
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Catch up on past streams and highlights from our live broadcasts.
        </p>
      </div>

      {archivedStreams.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4zM6 6v12h12V6H6zm3 3a1 1 0 112 0v6a1 1 0 11-2 0V9zm4 0a1 1 0 112 0v6a1 1 0 11-2 0V9z"/>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No archived streams yet</h3>
          <p className="text-gray-500">Past streams will appear here once they're completed.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {archivedStreams.map((stream) => (
            <div key={stream.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200">
              {/* Thumbnail */}
              <div className="aspect-video bg-gray-200 relative">
                {stream.metadata?.thumbnail?.imgix_url ? (
                  <img
                    src={`${stream.metadata.thumbnail.imgix_url}?w=600&h=400&fit=crop&auto=format,compress`}
                    alt={stream.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 bg-gray-900/80 text-white text-sm font-medium rounded-full">
                    {stream.metadata?.status === 'archived' ? 'Archived' : 'Offline'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                  {stream.title}
                </h3>
                
                {stream.metadata?.description && (
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {stream.metadata.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {stream.metadata?.scheduled_date ? 
                      new Date(stream.metadata.scheduled_date).toLocaleDateString() : 
                      new Date(stream.created_at).toLocaleDateString()
                    }
                  </div>
                  
                  {stream.metadata?.recording_url && (
                    <a
                      href={stream.metadata.recording_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Watch Recording
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}