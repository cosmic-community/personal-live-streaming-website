export interface SiteSettings {
  id: string;
  title: string;
  slug: string;
  created_at: string;
  modified_at: string;
  status: 'published' | 'draft';
  metadata: {
    site_title: string;
    site_name?: string;  // Adding missing property
    tagline?: string;    // Adding missing property
    site_description?: string;
    description?: string; // Adding missing property
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
      instagram?: string;
      discord?: string;
    };
    default_stream_message?: string;
    offline_message?: string;
  };
}

export interface Stream {
  id: string;
  title: string;
  slug: string;
  created_at: string;
  modified_at: string;
  status: 'published' | 'draft';
  thumbnail?: string;
  metadata?: {
    description?: string;
    scheduled_date?: string;
    status?: 'live' | 'offline' | 'scheduled' | 'archived';
    mux_stream_id?: string;
    stream_key?: string;
    playback_id?: string;
    is_featured?: boolean;
    duration?: string;
    viewer_count?: number;
    tags?: string[];
  };
}

export interface StreamAnnouncement {
  id: string;
  title: string;
  slug: string;
  created_at: string;
  modified_at: string;
  status: 'published' | 'draft';
  metadata: {
    message: string;
    type?: 'info' | 'warning' | 'success' | 'error';
    is_active: boolean;
    expiration_date?: string;
    link_url?: string;
    link_text?: string;
  };
}

// Component Props interfaces
export interface HeroSectionProps {
  siteSettings: SiteSettings | null;
}

export interface AnnouncementBannerProps {
  announcement: StreamAnnouncement;
}