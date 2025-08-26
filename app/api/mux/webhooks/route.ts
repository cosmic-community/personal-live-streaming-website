import { NextRequest, NextResponse } from 'next/server'
import { updateStreamStatus } from '@/lib/cosmic'

const WEBHOOK_SECRET = process.env.MUX_WEBHOOK_SECRET

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    
    // Verify webhook signature (recommended for production)
    const signature = request.headers.get('mux-signature')
    
    if (WEBHOOK_SECRET && signature) {
      // In production, verify the webhook signature here
      // This is important for security
    }

    const data = JSON.parse(body)
    
    // Handle different webhook events
    switch (data.type) {
      case 'video.live_stream.active':
        // Stream went live
        await handleStreamActive(data.data)
        break
        
      case 'video.live_stream.idle':
        // Stream went offline  
        await handleStreamIdle(data.data)
        break
        
      case 'video.live_stream.created':
        // New stream created
        await handleStreamCreated(data.data)
        break
        
      case 'video.asset.created':
        // Recording created from live stream
        await handleAssetCreated(data.data)
        break
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' }, 
      { status: 500 }
    )
  }
}

async function handleStreamActive(streamData: any) {
  console.log('Stream went live:', streamData.id)
  
  // Find the stream in Cosmic by playback_id and update status
  try {
    const playbackId = streamData.playback_ids[0]?.id
    if (playbackId) {
      // You'll need to implement findStreamByPlaybackId in cosmic.ts
      // Then update the stream status to 'live'
      console.log('Stream is now live with playback ID:', playbackId)
    }
  } catch (error) {
    console.error('Error updating stream to live:', error)
  }
}

async function handleStreamIdle(streamData: any) {
  console.log('Stream went offline:', streamData.id)
  
  // Update stream status to offline in Cosmic
  try {
    const playbackId = streamData.playback_ids[0]?.id
    if (playbackId) {
      console.log('Stream went offline with playback ID:', playbackId)
    }
  } catch (error) {
    console.error('Error updating stream to offline:', error)
  }
}

async function handleStreamCreated(streamData: any) {
  console.log('New stream created:', streamData.id)
}

async function handleAssetCreated(assetData: any) {
  console.log('Recording created:', assetData.id)
  // Handle recording of live stream
}