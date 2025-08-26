export interface Stream {
  id: string
  title: string
  slug: string
  status: 'published' | 'draft'
  created_at: string
  modified_at: string
  metadata?: {
    description?: string
    scheduled_date?: string
    status?: 'live' | 'offline' | 'scheduled' | 'archived'
    mux_stream_id?: string
    stream_key?: string
    playback_id?: string
    recording_url?: string
    tags?: string[]
    thumbnail?: {
      url: string
      imgix_url: string
    }
    category?: string
  }
}

export interface StreamAnnouncement {
  id: string
  title: string
  slug: string
  status: 'published' | 'draft'
  created_at: string
  modified_at: string
  metadata?: {
    message?: string
    is_active?: boolean
    expiration_date?: string
    announcement_type?: 'info' | 'warning' | 'success' | 'error'
    priority?: number
  }
}

export interface SiteSettings {
  id: string
  title: string
  slug: string
  status: 'published' | 'draft'
  created_at: string
  modified_at: string
  metadata?: {
    site_title?: string
    site_description?: string
    primary_color?: string
    secondary_color?: string
    logo?: {
      url: string
      imgix_url: string
    }
    social_links?: {
      twitter?: string
      youtube?: string
      instagram?: string
      discord?: string
    }
    stream_settings?: {
      default_playback_id?: string
      offline_message?: string
      chat_enabled?: boolean
    }
  }
}

// Component Props Types
export interface StreamPlayerProps {
  playbackId: string
  isLive: boolean
  title?: string
  className?: string
}

export interface StreamStatusProps {
  status: 'live' | 'offline' | 'scheduled' | 'archived'
  viewerCount?: number
  className?: string
}

export interface AnnouncementBannerProps {
  announcements: StreamAnnouncement[]
}

// API Response Types
export interface StreamStatusResponse {
  status: 'live' | 'offline' | 'scheduled' | 'archived'
  playbackId: string
  title?: string
  description?: string
  slug?: string
  scheduledDate?: string
  muxStreamId?: string
  isLive?: boolean
  recentAssets?: string[]
}

export interface MuxStreamResponse {
  streamId: string
  streamKey: string
  playbackId: string
  status: string
}

export interface MuxStreamStatus {
  streamId: string
  status: string
  playbackId: string
  streamKey: string
  isLive: boolean
  createdAt: string
  recentAssetIds: string[]
}