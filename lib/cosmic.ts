import { createBucketClient } from '@cosmicjs/sdk'
import type { Stream, StreamAnnouncement, SiteSettings } from '@/types'

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
})

// Simple error helper for Cosmic SDK
function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

// Fetch current live stream
export async function getCurrentStream(): Promise<Stream | null> {
  try {
    // Check if we have the required environment variables
    if (!process.env.COSMIC_BUCKET_SLUG || !process.env.COSMIC_READ_KEY) {
      console.warn('Missing Cosmic environment variables, returning null for getCurrentStream');
      return null;
    }

    const response = await cosmic.objects.find({
      type: 'streams',
      'metadata.status': 'live'
    }).props(['id', 'title', 'slug', 'metadata']).depth(1);

    const streams = response.objects as Stream[];
    return streams.length > 0 ? (streams[0] ?? null) : null;
  } catch (error) {
    console.warn('Error fetching current stream:', error);
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    // Return null instead of throwing to prevent build failures
    return null;
  }
}

// Fetch all streams for archive
export async function getAllStreams(): Promise<Stream[]> {
  try {
    if (!process.env.COSMIC_BUCKET_SLUG || !process.env.COSMIC_READ_KEY) {
      console.warn('Missing Cosmic environment variables, returning empty array for getAllStreams');
      return [];
    }

    const response = await cosmic.objects.find({
      type: 'streams'
    }).props(['id', 'title', 'slug', 'metadata']).depth(1);

    const streams = response.objects as Stream[];
    return streams.sort((a, b) => {
      const dateA = new Date(a.metadata?.scheduled_date || a.created_at).getTime();
      const dateB = new Date(b.metadata?.scheduled_date || b.created_at).getTime();
      return dateB - dateA; // Most recent first
    });
  } catch (error) {
    console.warn('Error fetching all streams:', error);
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    return [];
  }
}

// Fetch stream by slug
export async function getStreamBySlug(slug: string): Promise<Stream | null> {
  try {
    if (!process.env.COSMIC_BUCKET_SLUG || !process.env.COSMIC_READ_KEY) {
      console.warn('Missing Cosmic environment variables, returning null for getStreamBySlug');
      return null;
    }

    const response = await cosmic.objects.findOne({
      type: 'streams',
      slug
    }).depth(1);

    return response.object ? (response.object as Stream) : null;
  } catch (error) {
    console.warn(`Error fetching stream with slug ${slug}:`, error);
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    return null;
  }
}

// Fetch active announcements
export async function getActiveAnnouncements(): Promise<StreamAnnouncement[]> {
  try {
    if (!process.env.COSMIC_BUCKET_SLUG || !process.env.COSMIC_READ_KEY) {
      console.warn('Missing Cosmic environment variables, returning empty array for getActiveAnnouncements');
      return [];
    }

    const response = await cosmic.objects.find({
      type: 'announcements',
      'metadata.is_active': true
    }).props(['id', 'title', 'metadata']).depth(1);

    const announcements = response.objects as StreamAnnouncement[];
    
    // Filter out expired announcements
    const now = new Date();
    return announcements.filter(announcement => {
      if (!announcement.metadata?.expiration_date) {
        return true; // No expiration date means it's always active
      }
      return new Date(announcement.metadata.expiration_date) > now;
    });
  } catch (error) {
    console.warn('Error fetching active announcements:', error);
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    return [];
  }
}

// Fetch site settings
export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    if (!process.env.COSMIC_BUCKET_SLUG || !process.env.COSMIC_READ_KEY) {
      console.warn('Missing Cosmic environment variables, returning null for getSiteSettings');
      return null;
    }

    const response = await cosmic.objects.findOne({
      type: 'settings',
      slug: 'site-settings'
    }).depth(1);

    return response.object ? (response.object as SiteSettings) : null;
  } catch (error) {
    console.warn('Error fetching site settings:', error);
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    return null;
  }
}

// Update stream status (for admin functionality)
export async function updateStreamStatus(streamId: string, status: 'live' | 'offline' | 'archived'): Promise<Stream | null> {
  try {
    if (!process.env.COSMIC_BUCKET_SLUG || !process.env.COSMIC_READ_KEY || !process.env.COSMIC_WRITE_KEY) {
      console.warn('Missing Cosmic environment variables for write operation');
      return null;
    }

    const response = await cosmic.objects.updateOne(streamId, {
      metadata: {
        status: status
      }
    });

    return response.object as Stream;
  } catch (error) {
    console.error(`Failed to update stream status: ${error}`);
    return null;
  }
}