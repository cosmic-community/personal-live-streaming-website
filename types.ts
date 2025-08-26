export interface SiteSettings {
  id: string
  title: string
  slug: string
  created_at: string
  modified_at: string
  status: 'published' | 'draft'
  metadata?: {
    site_title?: string
    site_name?: string
    site_description?: string
    tagline?: string
    description?: string
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
      twitch?: string
    }
    stream_settings?: {
      default_playback_id?: string
      enable_chat?: boolean
      max_viewers?: number
    }
  }
}

export interface Stream {
  id: string
  title: string
  slug: string
  created_at: string
  modified_at: string
  status: 'published' | 'draft'
  thumbnail?: string
  metadata?: {
    description?: string
    scheduled_date?: string
    status?: 'live' | 'offline' | 'scheduled' | 'archived'
    mux_stream_id?: string
    stream_key?: string
    playback_id?: string
    viewer_count?: number
    category?: string
    tags?: string[]
    is_featured?: boolean
    recording_url?: string
  }
}

export interface StreamAnnouncement {
  id: string
  title: string
  slug: string
  created_at: string
  modified_at: string
  status: 'published' | 'draft'
  metadata?: {
    message?: string
    type?: 'info' | 'warning' | 'success' | 'error'
    is_active?: boolean
    expiration_date?: string
    show_on_homepage?: boolean
    priority?: number
  }
}

export interface StreamPlayerProps {
  stream: Stream | null
  description?: string
}

export interface RealTimeStreamPlayerProps {
  playbackId: string
  isLive: boolean
  title: string
  description?: string
}

export interface StreamStatusProps {
  status: 'live' | 'offline' | 'scheduled' | 'archived'
  scheduledDate?: string
  viewerCount?: number
}

export interface AnnouncementBannerProps {
  announcement: StreamAnnouncement
}