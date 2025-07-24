import { WebSocketServer } from 'ws'
import { Server } from 'http'
import { handleMessage } from './queueProcessor'

export function initWebSocket(server: Server) {
  const wss = new WebSocketServer({ noServer: true })

  wss.on('connection', (ws, req) => {
    ws.on('message', message => {
      try {
        const parsed = JSON.parse(message.toString())
        handleMessage(parsed, ws)
      } catch (err) {
        console.error('Invalid message received on WebSocket:', err)
        ws.send(JSON.stringify({ error: 'Invalid message format' }))
      }
    })

    ws.on('error', (err) => {
      console.error('WebSocket error:', err)
    })

    ws.on('close', () => {
      console.log('🔌 WebSocket connection closed')
    })
  })

  server.on('upgrade', (req, socket, head) => {
    if (req.url === '/ws') {
      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit('connection', ws, req)
      })
    } else {
      socket.destroy()
    }
  })

  console.log('WebSocket server initialized on /ws')
}
