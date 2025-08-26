// app/api/mux/stream/[streamId]/route.ts
import { NextRequest, NextResponse } from 'next/server'

const MUX_TOKEN_ID = process.env.MUX_TOKEN_ID
const MUX_TOKEN_SECRET = process.env.MUX_TOKEN_SECRET
const authHeader = Buffer.from(`${MUX_TOKEN_ID}:${MUX_TOKEN_SECRET}`).toString('base64')

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ streamId: string }> }
) {
  try {
    const { streamId } = await params

    if (!MUX_TOKEN_ID || !MUX_TOKEN_SECRET) {
      return NextResponse.json(
        { error: 'Mux credentials not configured' }, 
        { status: 500 }
      )
    }

    // Get specific stream details from Mux
    const response = await fetch(`https://api.mux.com/video/v1/live-streams/${streamId}`, {
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Stream not found' }, 
          { status: 404 }
        )
      }
      throw new Error(`Mux API error: ${response.status}`)
    }

    const data = await response.json()
    const stream = data.data

    return NextResponse.json({
      streamId: stream.id,
      status: stream.status,
      playbackId: stream.playback_ids[0]?.id,
      streamKey: stream.stream_key,
      isLive: stream.status === 'active' && stream.recent_asset_ids && stream.recent_asset_ids.length > 0,
      createdAt: stream.created_at,
      recentAssetIds: stream.recent_asset_ids || []
    })

  } catch (error) {
    console.error('Error fetching Mux stream:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stream data' }, 
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ streamId: string }> }
) {
  try {
    const { streamId } = await params

    if (!MUX_TOKEN_ID || !MUX_TOKEN_SECRET) {
      return NextResponse.json(
        { error: 'Mux credentials not configured' }, 
        { status: 500 }
      )
    }

    // Delete stream from Mux
    const response = await fetch(`https://api.mux.com/video/v1/live-streams/${streamId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Mux API error: ${response.status}`)
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error deleting Mux stream:', error)
    return NextResponse.json(
      { error: 'Failed to delete stream' }, 
      { status: 500 }
    )
  }
}