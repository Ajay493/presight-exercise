import type { Person } from '../types/person'

export type WSMessage = Person | { type: 'no_more_data' } | { error: string }

export function createWebSocket(onMessage: (data: WSMessage) => void): WebSocket {
  const socket = new WebSocket('ws://localhost:4000/ws')

  socket.onopen = () => {
    console.log('WebSocket connected')
  }

  socket.onmessage = (event: MessageEvent) => {
    try {
      const parsed = JSON.parse(event.data) as WSMessage
      onMessage(parsed)
    } catch (error) {
      console.error('WS parse error', error)
    }
  }

  socket.onerror = (error) => {
    console.error('WebSocket error:', error)
  }

  socket.onclose = () => {
    console.log('WebSocket disconnected')
  }

  return socket
}
