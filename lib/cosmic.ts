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
    const response = await cosmic.objects.find({
      type: 'streams',
      'metadata.status': 'live'
    }).props(['id', 'title', 'slug', 'metadata']).depth(1);

    const streams = response.objects as Stream[];
    return streams.length > 0 ? streams[0] : null;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch current stream');
  }
}

// Fetch all streams for archive
export async function getAllStreams(): Promise<Stream[]> {
  try {
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
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch streams');
  }
}

// Fetch stream by slug
export async function getStreamBySlug(slug: string): Promise<Stream | null> {
  try {
    const response = await cosmic.objects.findOne({
      type: 'streams',
      slug
    }).depth(1);

    // Fix: Explicitly handle the undefined case by checking if object exists
    return response.object ? (response.object as Stream) : null;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error(`Failed to fetch stream with slug: ${slug}`);
  }
}

// Fetch active announcements
export async function getActiveAnnouncements(): Promise<StreamAnnouncement[]> {
  try {
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
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch announcements');
  }
}

// Fetch site settings
export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const response = await cosmic.objects.findOne({
      type: 'settings',
      slug: 'site-settings'
    }).depth(1);

    // Fix: Explicitly handle the undefined case by checking if object exists
    return response.object ? (response.object as SiteSettings) : null;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch site settings');
  }
}

// Update stream status (for admin functionality)
export async function updateStreamStatus(streamId: string, status: 'live' | 'offline' | 'archived'): Promise<Stream> {
  try {
    const response = await cosmic.objects.updateOne(streamId, {
      metadata: {
        status: status
      }
    });

    return response.object as Stream;
  } catch (error) {
    throw new Error(`Failed to update stream status: ${error}`);
  }
}