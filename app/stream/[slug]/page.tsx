// app/stream/[slug]/page.tsx
import { getStreamBySlug } from '@/lib/cosmic'
import { notFound } from 'next/navigation'
import StreamPlayer from '@/components/StreamPlayer'
import StreamInfo from '@/components/StreamInfo'
import Link from 'next/link'

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-gray-700 transition-colors duration-200">
          Home
        </Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <Link href="/archive" className="hover:text-gray-700 transition-colors duration-200">
          Archive
        </Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-gray-700">{stream.title}</span>
      </nav>

      {/* Stream Player */}
      <div className="mb-8">
        <div className="stream-container">
          <StreamPlayer 
            playbackId={playbackId}
            isLive={isLive}
            title={stream.title}
            description={stream.metadata?.description}
          />
        </div>
      </div>

      {/* Stream Information */}
      <StreamInfo stream={stream} />

      {/* Back to Archive */}
      <div className="mt-12 text-center">
        <Link
          href="/archive"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Archive
        </Link>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: StreamPageProps) {
  const { slug } = await params
  const stream = await getStreamBySlug(slug)

  if (!stream) {
    return {
      title: 'Stream Not Found',
    }
  }

  return {
    title: `${stream.title} - Personal Live Streaming`,
    description: stream.metadata?.description || `Watch ${stream.title}`,
    openGraph: {
      title: stream.title,
      description: stream.metadata?.description,
      images: stream.metadata?.thumbnail ? [stream.metadata.thumbnail.imgix_url] : [],
    },
  }
}