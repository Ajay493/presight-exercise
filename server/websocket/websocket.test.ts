import http from 'http'
import WebSocket from 'ws'
import { handleMessage } from './queueProcessor'
import { initWebSocket } from './websocket'

jest.mock('./queueProcessor')

describe('initWebSocket', () => {
  let server: http.Server
  let port: number

  beforeAll(done => {
    server = http.createServer()
    initWebSocket(server)
    server.listen(() => {
      port = (server.address() as any).port
      done()
    })
  })

  afterAll(done => {
    server.close(done)
  })

  it('should call handleMessage when valid message received', (done) => {
    const ws = new WebSocket(`ws://localhost:${port}/ws`)

    ws.on('open', () => {
      const msg = JSON.stringify({ type: 'start_stream', count: 1, page: 1 })
      ws.send(msg)
    })

    ;(handleMessage as jest.Mock).mockImplementation((msg, _ws) => {
      expect(msg).toEqual({ type: 'start_stream', count: 1, page: 1 })
      ws.close()
      done()
    })

    ws.on('error', done)
  })

  it('should send error for invalid JSON message', (done) => {
    const ws = new WebSocket(`ws://localhost:${port}/ws`)

    ws.on('open', () => {
      ws.send('invalid json')
    })

    ws.on('message', (data) => {
      const response = JSON.parse(data.toString())
      expect(response).toHaveProperty('error', 'Invalid message format')
      ws.close()
      done()
    })

    ws.on('error', done)
  })

  it('should log on WebSocket close', (done) => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

    const ws = new WebSocket(`ws://localhost:${port}/ws`)

    ws.on('open', () => {
      ws.close()
    })

    ws.on('close', () => {
      expect(consoleSpy).toHaveBeenCalledWith('🔌 WebSocket connection closed')
      consoleSpy.mockRestore()
      done()
    })

    ws.on('error', done)
  })

  it('should destroy socket if url is not /ws', (done) => {
    // We create a fake socket to spy on destroy call
    const socket = {
      destroy: jest.fn()
    }
    const req = { url: '/not-ws' } as any
    const head = Buffer.alloc(0)

    // Call upgrade handler manually
    server.emit('upgrade', req, socket as any, head)

    expect(socket.destroy).toHaveBeenCalled()
    done()
  })
})
