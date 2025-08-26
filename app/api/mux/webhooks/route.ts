import { NextRequest, NextResponse } from 'next/server'
import { findStreamByMuxId, updateStreamStatus, findStreamByPlaybackId } from '@/lib/cosmic'

const WEBHOOK_SECRET = process.env.MUX_WEBHOOK_SECRET

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    
    // Verify webhook signature (recommended for production)
    const signature = request.headers.get('mux-signature')
    
    if (WEBHOOK_SECRET && signature) {
      // In production, verify the webhook signature here
      // This is important for security
      console.log('Webhook signature verification would happen here')
    }

    const data = JSON.parse(body)
    console.log('Received webhook:', data.type, data.data?.id)
    
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
        
      case 'video.live_stream.disconnected':
        // Stream disconnected
        await handleStreamDisconnected(data.data)
        break
        
      case 'video.asset.created':
        // Recording created from live stream
        await handleAssetCreated(data.data)
        break

      default:
        console.log(`Unhandled webhook event: ${data.type}`)
    }

    return NextResponse.json({ 
      success: true, 
      message: `Processed ${data.type} event` 
    })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' }, 
      { status: 500 }
    )
  }
}

async function handleStreamActive(streamData: any) {
  console.log('🔴 Stream went live:', streamData.id)
  
  try {
    // Find the stream in Cosmic by Mux stream ID
    const cosmicStream = await findStreamByMuxId(streamData.id)
    
    if (cosmicStream) {
      console.log('Updating Cosmic stream to live status:', cosmicStream.id)
      await updateStreamStatus(cosmicStream.id, 'live')
    } else {
      console.log('No matching Cosmic stream found for Mux ID:', streamData.id)
      // Optionally create a new stream record in Cosmic here
    }

    // Also try finding by playback ID as fallback
    const playbackId = streamData.playback_ids?.[0]?.id
    if (playbackId && !cosmicStream) {
      console.log('Trying to find stream by playback ID:', playbackId)
      const streamByPlaybackId = await findStreamByPlaybackId(playbackId)
      if (streamByPlaybackId) {
        await updateStreamStatus(streamByPlaybackId.id, 'live')
      }
    }
    
  } catch (error) {
    console.error('Error updating stream to live:', error)
  }
}

async function handleStreamIdle(streamData: any) {
  console.log('⚪ Stream went idle/offline:', streamData.id)
  
  try {
    const cosmicStream = await findStreamByMuxId(streamData.id)
    
    if (cosmicStream) {
      console.log('Updating Cosmic stream to offline status:', cosmicStream.id)
      await updateStreamStatus(cosmicStream.id, 'offline')
    } else {
      // Try finding by playback ID
      const playbackId = streamData.playback_ids?.[0]?.id
      if (playbackId) {
        const streamByPlaybackId = await findStreamByPlaybackId(playbackId)
        if (streamByPlaybackId) {
          await updateStreamStatus(streamByPlaybackId.id, 'offline')
        }
      }
    }
    
  } catch (error) {
    console.error('Error updating stream to offline:', error)
  }
}

async function handleStreamDisconnected(streamData: any) {
  console.log('🔌 Stream disconnected:', streamData.id)
  
  try {
    const cosmicStream = await findStreamByMuxId(streamData.id)
    
    if (cosmicStream) {
      await updateStreamStatus(cosmicStream.id, 'offline')
    }
    
  } catch (error) {
    console.error('Error handling stream disconnect:', error)
  }
}

async function handleStreamCreated(streamData: any) {
  console.log('➕ New stream created:', streamData.id)
  
  // You could automatically create a corresponding stream record in Cosmic here
  // For now, just log the event
  console.log('Stream details:', {
    id: streamData.id,
    streamKey: streamData.stream_key,
    playbackId: streamData.playback_ids?.[0]?.id,
    status: streamData.status
  })
}

async function handleAssetCreated(assetData: any) {
  console.log('📹 Recording created:', assetData.id)
  
  // Handle recording of live stream
  // You could update the corresponding stream in Cosmic to link to the recording
  if (assetData.live_stream_id) {
    console.log('Recording created for live stream:', assetData.live_stream_id)
    // Optionally update the Cosmic stream record with the recording information
  }
}