'use client'

import { io, Socket } from 'socket.io-client'
import type { Stream } from '@/types'

let socket: Socket | null = null

export interface StreamUpdateData {
  status: 'live' | 'offline' | 'scheduled' | 'archived'
  playbackId?: string
  title?: string
  description?: string
  slug?: string
  scheduledDate?: string
}

export function getSocket(): Socket {
  if (!socket) {
    // In a real implementation, this would connect to your WebSocket server
    // For demo purposes, we'll create a mock socket that simulates updates
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'ws://localhost:3001', {
      autoConnect: false,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      timeout: 20000,
    })

    socket.on('connect', () => {
      console.log('WebSocket connected')
    })

    socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason)
    })

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error)
    })
  }

  return socket
}

export function connectSocket(): void {
  const socketInstance = getSocket()
  if (!socketInstance.connected) {
    socketInstance.connect()
  }
}

export function disconnectSocket(): void {
  if (socket?.connected) {
    socket.disconnect()
  }
}

export function subscribeToStreamUpdates(callback: (data: StreamUpdateData) => void): void {
  const socketInstance = getSocket()
  
  socketInstance.on('stream_update', callback)
  
  // Also listen for stream status changes
  socketInstance.on('stream_status_change', callback)
}

export function unsubscribeFromStreamUpdates(callback: (data: StreamUpdateData) => void): void {
  const socketInstance = getSocket()
  
  socketInstance.off('stream_update', callback)
  socketInstance.off('stream_status_change', callback)
}

// Simulate stream updates for demo purposes
export function startMockStreamUpdates(): void {
  const socketInstance = getSocket()
  
  // Simulate going live after 10 seconds
  setTimeout(() => {
    socketInstance.emit('mock_stream_update', {
      status: 'live',
      playbackId: 'NPQ01ZJs9TAkBnsxlfsF2CvNwHXTooFdcxrgGXFEi7cs',
      title: 'Live Demo Stream',
      description: 'This is a simulated live stream for demonstration',
      slug: 'demo-stream'
    })
  }, 10000)

  // Simulate going offline after 60 seconds
  setTimeout(() => {
    socketInstance.emit('mock_stream_update', {
      status: 'offline',
      playbackId: null,
      title: 'Stream Ended',
      description: 'The demo stream has ended'
    })
  }, 60000)
}