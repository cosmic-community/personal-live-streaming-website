import { NextResponse } from 'next/server'
import { getCurrentStream } from '@/lib/cosmic'

export async function GET() {
  try {
    const stream = await getCurrentStream()
    
    if (!stream) {
      return NextResponse.json({ 
        status: 'offline',
        playbackId: null,
        message: 'No active stream' 
      })
    }

    return NextResponse.json({
      status: stream.metadata?.status || 'offline',
      playbackId: stream.metadata?.playback_id || null,
      title: stream.title,
      description: stream.metadata?.description,
      slug: stream.slug,
      scheduledDate: stream.metadata?.scheduled_date
    })
  } catch (error) {
    console.error('Error fetching stream status:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stream status' }, 
      { status: 500 }
    )
  }
}