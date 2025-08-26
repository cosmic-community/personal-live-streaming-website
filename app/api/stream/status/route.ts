import { NextResponse } from 'next/server'
import { getCurrentStream } from '@/lib/cosmic'

const MUX_TOKEN_ID = process.env.MUX_TOKEN_ID
const MUX_TOKEN_SECRET = process.env.MUX_TOKEN_SECRET
const authHeader = Buffer.from(`${MUX_TOKEN_ID}:${MUX_TOKEN_SECRET}`).toString('base64')

export async function GET() {
  try {
    // Get current stream from Cosmic CMS
    const stream = await getCurrentStream()
    
    if (!stream || !stream.metadata?.mux_stream_id) {
      return NextResponse.json({ 
        status: 'offline',
        playbackId: stream?.metadata?.playback_id || 'NPQ01ZJs9TAkBnsxlfsF2CvNwHXTooFdcxrgGXFEi7cs',
        message: 'No active stream configured',
        title: stream?.title,
        description: stream?.metadata?.description
      })
    }

    // Check actual stream status from Mux
    if (MUX_TOKEN_ID && MUX_TOKEN_SECRET && stream.metadata.mux_stream_id) {
      try {
        const response = await fetch(`https://api.mux.com/video/v1/live-streams/${stream.metadata.mux_stream_id}`, {
          headers: {
            'Authorization': `Basic ${authHeader}`,
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          const muxData = await response.json()
          const muxStream = muxData.data
          
          // Determine if stream is actually live
          const isLive = muxStream.status === 'active' && 
                        muxStream.recent_asset_ids && 
                        muxStream.recent_asset_ids.length > 0

          return NextResponse.json({
            status: isLive ? 'live' : 'offline',
            playbackId: stream.metadata.playback_id,
            title: stream.title,
            description: stream.metadata.description,
            slug: stream.slug,
            scheduledDate: stream.metadata.scheduled_date,
            muxStatus: muxStream.status,
            muxStreamId: stream.metadata.mux_stream_id,
            isLive,
            recentAssets: muxStream.recent_asset_ids || []
          })
        }
      } catch (muxError) {
        console.error('Error checking Mux stream status:', muxError)
      }
    }

    // Fallback to Cosmic status if Mux check fails
    return NextResponse.json({
      status: stream.metadata?.status || 'offline',
      playbackId: stream.metadata?.playback_id,
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