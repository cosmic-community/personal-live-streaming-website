import type { StreamStatusProps } from '@/types'

export default function StreamStatus({ 
  status, 
  scheduledDate, 
  viewerCount 
}: StreamStatusProps) {
  const formatScheduledDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    })
  }

  if (status === 'live') {
    return (
      <div className="live-indicator">
        <span className="pulse-dot"></span>
        <span>LIVE</span>
        {viewerCount && (
          <span className="text-xs opacity-75">
            {viewerCount} {viewerCount === 1 ? 'viewer' : 'viewers'}
          </span>
        )}
      </div>
    )
  }

  if (status === 'scheduled' && scheduledDate) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Scheduled for {formatScheduledDate(scheduledDate)}</span>
      </div>
    )
  }

  return (
    <div className="offline-indicator">
      <span className="w-2 h-2 bg-white rounded-full opacity-60"></span>
      <span>OFFLINE</span>
    </div>
  )
}