'use client'

interface StreamStatusProps {
  status: 'live' | 'offline' | 'scheduled' | 'archived'
  scheduledDate?: string
  viewerCount?: number
}

export default function StreamStatus({ status, scheduledDate, viewerCount }: StreamStatusProps) {
  const getStatusDisplay = () => {
    switch (status) {
      case 'live':
        return {
          text: 'LIVE NOW',
          color: 'bg-red-500 text-white',
          icon: '🔴',
          animate: true
        }
      case 'scheduled':
        return {
          text: 'SCHEDULED',
          color: 'bg-yellow-500 text-black',
          icon: '📅',
          animate: false
        }
      case 'archived':
        return {
          text: 'ARCHIVED',
          color: 'bg-gray-500 text-white',
          icon: '📼',
          animate: false
        }
      default:
        return {
          text: 'OFFLINE',
          color: 'bg-gray-600 text-white',
          icon: '⚫',
          animate: false
        }
    }
  }

  const statusDisplay = getStatusDisplay()

  return (
    <div className="flex items-center gap-4">
      {/* Status Badge */}
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${statusDisplay.color} ${
        statusDisplay.animate ? 'animate-pulse' : ''
      }`}>
        <span>{statusDisplay.icon}</span>
        <span>{statusDisplay.text}</span>
      </div>

      {/* Viewer Count */}
      {status === 'live' && viewerCount !== undefined && (
        <div className="flex items-center gap-2 text-gray-300">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
          </svg>
          <span className="text-sm font-medium">
            {viewerCount.toLocaleString()} {viewerCount === 1 ? 'viewer' : 'viewers'}
          </span>
        </div>
      )}

      {/* Scheduled Date */}
      {status === 'scheduled' && scheduledDate && (
        <div className="flex items-center gap-2 text-gray-300">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-sm">
            {new Date(scheduledDate).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short', 
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit'
            })}
          </span>
        </div>
      )}

      {/* Additional Status Info */}
      {status === 'archived' && (
        <div className="text-gray-400 text-sm">
          Available for replay
        </div>
      )}
    </div>
  )
}