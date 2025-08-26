// Base Cosmic object interface
interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, any>;
  type: string;
  created_at: string;
  modified_at: string;
}

// Stream object interface
export interface Stream extends CosmicObject {
  type: 'streams';
  metadata: {
    description?: string;
    stream_key?: string;
    playback_id?: string;
    status: StreamStatus;
    scheduled_date?: string;
    duration?: number;
    thumbnail?: {
      url: string;
      imgix_url: string;
    };
    is_featured?: boolean;
    category?: StreamCategory;
    tags?: string[];
  };
}

// Stream announcement interface
export interface StreamAnnouncement extends CosmicObject {
  type: 'announcements';
  metadata: {
    message: string;
    type: AnnouncementType;
    priority: 'low' | 'medium' | 'high';
    expiration_date?: string;
    is_active: boolean;
  };
}

// Site settings interface
export interface SiteSettings extends CosmicObject {
  type: 'settings';
  metadata: {
    site_title: string;
    site_description?: string;
    logo?: {
      url: string;
      imgix_url: string;
    };
    brand_colors?: {
      primary: string;
      secondary: string;
    };
    social_links?: {
      twitter?: string;
      youtube?: string;
      twitch?: string;
    };
    default_stream_message?: string;
    offline_message?: string;
  };
}

// Type literals for select-dropdown values
export type StreamStatus = 'live' | 'scheduled' | 'offline' | 'archived';
export type AnnouncementType = 'general' | 'schedule' | 'technical' | 'promotion';
export type StreamCategory = 'gaming' | 'tech' | 'education' | 'entertainment' | 'music' | 'other';

// API response types
export interface CosmicResponse<T> {
  objects: T[];
  total: number;
  limit: number;
  skip: number;
}

// WebSocket types
export interface StreamWebSocketData {
  status: StreamStatus;
  playbackId?: string;
  title?: string;
  description?: string;
  slug?: string;
  scheduledDate?: string;
  viewerCount?: number;
}

// Type guards
export function isStream(obj: CosmicObject): obj is Stream {
  return obj.type === 'streams';
}

export function isStreamAnnouncement(obj: CosmicObject): obj is StreamAnnouncement {
  return obj.type === 'announcements';
}

export function isSiteSettings(obj: CosmicObject): obj is SiteSettings {
  return obj.type === 'settings';
}

// Component prop types
export interface StreamPlayerProps {
  playbackId: string;
  isLive: boolean;
  title?: string;
  description?: string;
}

export interface StreamStatusProps {
  status: StreamStatus;
  scheduledDate?: string;
  viewerCount?: number;
}

export interface AnnouncementBannerProps {
  announcements: StreamAnnouncement[];
}

export interface RealTimeStreamPlayerProps {
  initialStream: Stream | null;
  fallbackPlaybackId?: string;
}