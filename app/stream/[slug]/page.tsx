// app/stream/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getStreamBySlug } from '@/lib/cosmic'
import RealTimeStreamPlayer from '@/components/RealTimeStreamPlayer'
import StreamInfo from '@/components/StreamInfo'
import CosmicBadge from '@/components/CosmicBadge'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function StreamPage({ params }: PageProps) {
  const { slug } = await params
  const stream = await getStreamBySlug(slug)
  const bucketSlug = process.env.COSMIC_BUCKET_SLUG as string

  if (!stream) {
    notFound()
  }

  const isLive = stream.metadata?.status === 'live'
  const playbackId = stream.metadata?.playback_id || 'NPQ01ZJs9TAkBnsxlfsF2CvNwHXTooFdcxrgGXFEi7cs' // fallback

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back to home link */}
        <div className="mb-6">
          <a 
            href="/" 
            className="inline-flex items-center gap-2 text-purple-300 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </a>
        </div>

        {/* Stream Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {stream.title}
          </h1>
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                isLive ? 'bg-red-500 animate-pulse' : 'bg-gray-500'
              }`}></div>
              <span className="text-white font-medium">
                {isLive ? 'LIVE NOW' : 'OFFLINE'}
              </span>
            </div>
            {stream.metadata?.scheduled_date && (
              <div className="text-gray-300">
                Scheduled: {new Date(stream.metadata.scheduled_date).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>

        {/* Real-time Stream Player */}
        <div className="max-w-6xl mx-auto mb-8">
          <RealTimeStreamPlayer 
            playbackId={playbackId}
            isLive={isLive}
            title={stream.title}
            description={stream.metadata?.description}
          />
        </div>

        {/* Stream Information */}
        <div className="max-w-4xl mx-auto">
          <StreamInfo stream={stream} />
        </div>
      </div>

      <CosmicBadge bucketSlug={bucketSlug} />
    </main>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const stream = await getStreamBySlug(slug)

  if (!stream) {
    return {
      title: 'Stream Not Found',
      description: 'The requested stream could not be found.'
    }
  }

  return {
    title: stream.title,
    description: stream.metadata?.description || `Watch ${stream.title} live stream`,
    openGraph: {
      title: stream.title,
      description: stream.metadata?.description || `Watch ${stream.title} live stream`,
      type: 'video.other',
      images: stream.thumbnail ? [{ url: stream.thumbnail }] : []
    }
  }
}