// app/stream/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getStreamBySlug } from '@/lib/cosmic'
import RealTimeStreamPlayer from '@/components/RealTimeStreamPlayer'
import StreamInfo from '@/components/StreamInfo'
import StreamStatus from '@/components/StreamStatus'

interface StreamPageProps {
  params: Promise<{ slug: string }>
}

export default async function StreamPage({ params }: StreamPageProps) {
  const { slug } = await params
  
  const stream = await getStreamBySlug(slug)
  
  if (!stream) {
    notFound()
  }

  const isLive = stream.metadata?.status === 'live'
  const playbackId = stream.metadata?.playback_id || 'NPQ01ZJs9TAkBnsxlfsF2CvNwHXTooFdcxrgGXFEi7cs'

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Stream Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {stream.title}
        </h1>
        
        <div className="flex items-center justify-center gap-4 mb-6">
          <StreamStatus 
            status={stream.metadata?.status || 'offline'} 
            className="text-lg"
          />
          
          {stream.metadata?.scheduled_date && (
            <div className="flex items-center text-gray-600">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(stream.metadata.scheduled_date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Video Player - Takes up most of the space */}
        <div className="lg:col-span-3">
          <div className="bg-black rounded-lg overflow-hidden shadow-2xl">
            {isLive || stream.metadata?.recording_url ? (
              <RealTimeStreamPlayer 
                playbackId={playbackId}
                isLive={isLive}
                title={stream.title}
              />
            ) : (
              <div className="aspect-video bg-gray-900 flex items-center justify-center text-white">
                {stream.metadata?.thumbnail?.imgix_url ? (
                  <div className="relative w-full h-full">
                    <img
                      src={`${stream.metadata.thumbnail.imgix_url}?w=1200&h=800&fit=crop&auto=format,compress`}
                      alt={stream.title}
                      className="w-full h-full object-cover opacity-50"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="text-center">
                        <svg className="w-16 h-16 mx-auto mb-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <p className="text-xl font-medium">Stream Offline</p>
                        <p className="text-white/70 mt-2">
                          {stream.metadata?.scheduled_date ? 
                            'Check back at the scheduled time' : 
                            'Stream will begin shortly'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <svg className="w-16 h-16 mx-auto mb-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p className="text-xl font-medium text-white/80">Stream Offline</p>
                    <p className="text-white/60 mt-2">
                      {stream.metadata?.scheduled_date ? 
                        'Check back at the scheduled time' : 
                        'Stream will begin shortly'
                      }
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Stream Description Below Video */}
          {stream.metadata?.description && (
            <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">About This Stream</h3>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  {stream.metadata.description}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <StreamInfo stream={stream} />
        </div>
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  // This could be enhanced to pre-generate paths for published streams
  return []
}

export async function generateMetadata({ params }: StreamPageProps) {
  const { slug } = await params
  const stream = await getStreamBySlug(slug)

  if (!stream) {
    return {
      title: 'Stream Not Found'
    }
  }

  return {
    title: `${stream.title} | Live Stream`,
    description: stream.metadata?.description || `Watch ${stream.title} live stream`,
    openGraph: {
      title: stream.title,
      description: stream.metadata?.description,
      type: 'video.other',
      images: stream.metadata?.thumbnail?.imgix_url ? [
        {
          url: `${stream.metadata.thumbnail.imgix_url}?w=1200&h=630&fit=crop&auto=format,compress`,
          width: 1200,
          height: 630,
          alt: stream.title,
        }
      ] : []
    }
  }
}