import type { Stream } from '@/types'

interface StreamInfoProps {
  stream: Stream
}

export default function StreamInfo({ stream }: StreamInfoProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  return (
    <div className="stream-info-card">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {stream.title}
          </h2>
          
          {stream.metadata?.description && (
            <p className="text-gray-600 mb-4 leading-relaxed">
              {stream.metadata.description}
            </p>
          )}
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            {stream.metadata?.scheduled_date && (
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{formatDate(stream.metadata.scheduled_date)}</span>
              </div>
            )}
            
            {stream.metadata?.duration && (
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{stream.metadata.duration} minutes</span>
              </div>
            )}
            
            {stream.metadata?.category && (
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span className="capitalize">{stream.metadata.category}</span>
              </div>
            )}
          </div>
        </div>
        
        {stream.metadata?.thumbnail && (
          <div className="lg:w-48 flex-shrink-0">
            <img
              src={`${stream.metadata.thumbnail.imgix_url}?w=192&h=108&fit=crop&auto=format,compress`}
              alt={stream.title}
              width="192"
              height="108"
              className="w-full rounded-lg shadow-sm"
            />
          </div>
        )}
      </div>
      
      {stream.metadata?.tags && stream.metadata.tags.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {stream.metadata.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}