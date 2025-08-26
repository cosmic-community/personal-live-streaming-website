import { NextRequest, NextResponse } from 'next/server'

const MUX_TOKEN_ID = process.env.MUX_TOKEN_ID
const MUX_TOKEN_SECRET = process.env.MUX_TOKEN_SECRET

// Base64 encode for Basic auth
const authHeader = Buffer.from(`${MUX_TOKEN_ID}:${MUX_TOKEN_SECRET}`).toString('base64')

export async function GET() {
  try {
    if (!MUX_TOKEN_ID || !MUX_TOKEN_SECRET) {
      return NextResponse.json(
        { error: 'Mux credentials not configured' }, 
        { status: 500 }
      )
    }

    // Fetch live streams from Mux
    const response = await fetch('https://api.mux.com/video/v1/live-streams', {
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Mux API error: ${response.status}`)
    }

    const data = await response.json()
    
    // Check which streams are currently active/live
    const liveStreams = data.data.filter((stream: any) => 
      stream.status === 'active' && stream.recent_asset_ids && stream.recent_asset_ids.length > 0
    )

    return NextResponse.json({
      streams: data.data,
      liveStreams,
      totalStreams: data.data.length,
      activeLiveStreams: liveStreams.length
    })

  } catch (error) {
    console.error('Error fetching Mux streams:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stream data from Mux' }, 
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!MUX_TOKEN_ID || !MUX_TOKEN_SECRET) {
      return NextResponse.json(
        { error: 'Mux credentials not configured' }, 
        { status: 500 }
      )
    }

    const body = await request.json()
    const { playback_policy = 'public' } = body

    // Create a new live stream in Mux
    const response = await fetch('https://api.mux.com/video/v1/live-streams', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        playback_policy: [playback_policy],
        new_asset_settings: {
          playback_policy: [playback_policy]
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Mux API error: ${response.status}`)
    }

    const data = await response.json()
    
    return NextResponse.json({
      streamId: data.data.id,
      streamKey: data.data.stream_key,
      playbackId: data.data.playback_ids[0]?.id,
      status: data.data.status
    })

  } catch (error) {
    console.error('Error creating Mux stream:', error)
    return NextResponse.json(
      { error: 'Failed to create stream' }, 
      { status: 500 }
    )
  }
}