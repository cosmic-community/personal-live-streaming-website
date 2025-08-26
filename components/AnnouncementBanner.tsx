'use client'

import { useState } from 'react'
import { AnnouncementBannerProps } from '@/types'

export default function AnnouncementBanner({ announcements }: AnnouncementBannerProps) {
  const [dismissedAnnouncements, setDismissedAnnouncements] = useState<string[]>([])

  if (!announcements || announcements.length === 0) {
    return null
  }

  const visibleAnnouncements = announcements.filter(
    announcement => !dismissedAnnouncements.includes(announcement.id)
  )

  if (visibleAnnouncements.length === 0) {
    return null
  }

  const dismissAnnouncement = (announcementId: string) => {
    setDismissedAnnouncements(prev => [...prev, announcementId])
  }

  const getAnnouncementColor = (type: string | undefined) => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800'
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800'
    }
  }

  const getIconColor = (type: string | undefined) => {
    switch (type) {
      case 'warning':
        return 'text-yellow-400'
      case 'error':
        return 'text-red-400'
      case 'success':
        return 'text-green-400'
      default:
        return 'text-blue-400'
    }
  }

  return (
    <div className="space-y-2">
      {visibleAnnouncements.map((announcement) => (
        <div 
          key={announcement.id}
          className={`border rounded-lg p-4 ${getAnnouncementColor(announcement.metadata?.announcement_type)}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start">
              <div className={`flex-shrink-0 ${getIconColor(announcement.metadata?.announcement_type)}`}>
                {announcement.metadata?.announcement_type === 'warning' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                ) : announcement.metadata?.announcement_type === 'error' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : announcement.metadata?.announcement_type === 'success' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium">
                  {announcement.title}
                </h3>
                {announcement.metadata?.message && (
                  <p className="mt-1 text-sm opacity-90">
                    {announcement.metadata.message}
                  </p>
                )}
              </div>
            </div>
            
            <button
              onClick={() => dismissAnnouncement(announcement.id)}
              className="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-600"
              aria-label="Dismiss announcement"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}