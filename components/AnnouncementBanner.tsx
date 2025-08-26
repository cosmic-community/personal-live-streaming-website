'use client'

import { useState } from 'react'
import type { AnnouncementBannerProps } from '@/types'

export default function AnnouncementBanner({ announcements }: AnnouncementBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible || !announcements || announcements.length === 0) {
    return null
  }

  const currentAnnouncement = announcements[currentIndex]
  
  const nextAnnouncement = () => {
    setCurrentIndex((prev) => (prev + 1) % announcements.length)
  }

  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high':
        return 'from-red-500 to-red-600'
      case 'medium':
        return 'from-yellow-500 to-orange-600'
      default:
        return 'from-blue-500 to-purple-600'
    }
  }

  return (
    <div className={`announcement-banner bg-gradient-to-r ${getPriorityColor(currentAnnouncement.metadata?.priority || 'low')}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
            <span className="font-medium text-sm uppercase tracking-wide">
              {currentAnnouncement.metadata?.type || 'Announcement'}
            </span>
          </div>
          <span className="text-sm sm:text-base">
            {currentAnnouncement.metadata?.message || currentAnnouncement.title}
          </span>
        </div>

        <div className="flex items-center gap-2 ml-4">
          {announcements.length > 1 && (
            <>
              <button
                onClick={nextAnnouncement}
                className="text-white hover:text-gray-200 transition-colors duration-200"
                aria-label="Next announcement"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <span className="text-xs opacity-75">
                {currentIndex + 1} / {announcements.length}
              </span>
            </>
          )}
          <button
            onClick={() => setIsVisible(false)}
            className="text-white hover:text-gray-200 transition-colors duration-200 ml-2"
            aria-label="Dismiss announcement"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}