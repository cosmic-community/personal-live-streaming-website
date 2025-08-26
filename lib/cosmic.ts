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
      type: 'streams'
    }).props(['id', 'title', 'slug', 'metadata']).depth(1);

    const streams = response.objects as Stream[];
    
    // Return the most recent live stream first, then any stream
    const liveStream = streams.find(stream => stream.metadata?.status === 'live');
    if (liveStream) {
      return liveStream;
    }
    
    // Return the most recent stream if no live stream - FIXED: return null instead of undefined
    return streams.length > 0 ? streams[0] || null : null;
  } catch (error) {
    console.warn('Error fetching current stream:', error);
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    return null;
  }
}

// Find stream by playback ID (for webhook processing)
export async function findStreamByPlaybackId(playbackId: string): Promise<Stream | null> {
  try {
    if (!process.env.COSMIC_BUCKET_SLUG || !process.env.COSMIC_READ_KEY) {
      return null;
    }

    const response = await cosmic.objects.find({
      type: 'streams',
      'metadata.playback_id': playbackId
    }).props(['id', 'title', 'slug', 'metadata']).depth(1);

    const streams = response.objects as Stream[];
    // FIXED: return null instead of undefined
    return streams.length > 0 ? streams[0] || null : null;
  } catch (error) {
    console.warn(`Error finding stream by playback ID ${playbackId}:`, error);
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    return null;
  }
}

// Find stream by Mux stream ID
export async function findStreamByMuxId(muxStreamId: string): Promise<Stream | null> {
  try {
    if (!process.env.COSMIC_BUCKET_SLUG || !process.env.COSMIC_READ_KEY) {
      return null;
    }

    const response = await cosmic.objects.find({
      type: 'streams',
      'metadata.mux_stream_id': muxStreamId
    }).props(['id', 'title', 'slug', 'metadata']).depth(1);

    const streams = response.objects as Stream[];
    // FIXED: return null instead of undefined  
    return streams.length > 0 ? streams[0] || null : null;
  } catch (error) {
    console.warn(`Error finding stream by Mux ID ${muxStreamId}:`, error);
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    return null;
  }
}

// Get all active live streams
export async function getActiveLiveStreams(): Promise<Stream[]> {
  try {
    if (!process.env.COSMIC_BUCKET_SLUG || !process.env.COSMIC_READ_KEY) {
      return [];
    }

    const response = await cosmic.objects.find({
      type: 'streams',
      'metadata.status': 'live'
    }).props(['id', 'title', 'slug', 'metadata']).depth(1);

    const streams = response.objects as Stream[];
    return streams.sort((a, b) => {
      const dateA = new Date(a.metadata?.scheduled_date || a.created_at).getTime();
      const dateB = new Date(b.metadata?.scheduled_date || b.created_at).getTime();
      return dateB - dateA; // Most recent first
    });
  } catch (error) {
    console.warn('Error fetching active live streams:', error);
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    return [];
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

// Update stream status (for webhook and admin functionality) - CRITICAL: MINIMAL METADATA UPDATE
export async function updateStreamStatus(streamId: string, status: 'live' | 'offline' | 'archived'): Promise<Stream | null> {
  try {
    if (!process.env.COSMIC_BUCKET_SLUG || !process.env.COSMIC_READ_KEY || !process.env.COSMIC_WRITE_KEY) {
      console.warn('Missing Cosmic environment variables for write operation');
      return null;
    }

    // CRITICAL: Only update the status field, not the entire metadata object
    const response = await cosmic.objects.updateOne(streamId, {
      metadata: {
        status: status
      }
    });

    console.log(`Successfully updated stream ${streamId} status to ${status}`);
    return response.object as Stream;
  } catch (error) {
    console.error(`Failed to update stream status: ${error}`);
    return null;
  }
}

// Update stream with Mux information - CRITICAL: MINIMAL METADATA UPDATE
export async function updateStreamMuxInfo(
  streamId: string, 
  muxData: {
    mux_stream_id: string;
    stream_key: string;
    playback_id: string;
    status?: string;
  }
): Promise<Stream | null> {
  try {
    if (!process.env.COSMIC_BUCKET_SLUG || !process.env.COSMIC_READ_KEY || !process.env.COSMIC_WRITE_KEY) {
      console.warn('Missing Cosmic environment variables for write operation');
      return null;
    }

    // CRITICAL: Only update the specific Mux fields, not the entire metadata object
    const response = await cosmic.objects.updateOne(streamId, {
      metadata: muxData
    });

    console.log(`Successfully updated stream ${streamId} with Mux info`);
    return response.object as Stream;
  } catch (error) {
    console.error(`Failed to update stream with Mux info: ${error}`);
    return null;
  }
}

// Create a new stream with Mux information
export async function createStreamWithMuxInfo(
  title: string,
  muxData: {
    mux_stream_id: string;
    stream_key: string;
    playback_id: string;
    status?: string;
  }
): Promise<Stream | null> {
  try {
    if (!process.env.COSMIC_BUCKET_SLUG || !process.env.COSMIC_READ_KEY || !process.env.COSMIC_WRITE_KEY) {
      console.warn('Missing Cosmic environment variables for write operation');
      return null;
    }

    const response = await cosmic.objects.insertOne({
      title,
      type: 'streams',
      status: 'published',
      metadata: {
        ...muxData,
        status: muxData.status || 'offline',
        scheduled_date: new Date().toISOString()
      }
    });

    console.log(`Successfully created new stream with Mux info:`, response.object.id);
    return response.object as Stream;
  } catch (error) {
    console.error(`Failed to create stream with Mux info: ${error}`);
    return null;
  }
}