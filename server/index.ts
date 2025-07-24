import express from 'express'
import cors from 'cors'
import http from 'http'
import peopleRoutes from './routes/people'
import { initWebSocket } from './websocket/websocket'
import textRoutes from './routes/text'

const app = express()
const server = http.createServer(app)
const port = 4000

app.use(cors())
app.use(express.json())

app.use('/api', peopleRoutes)
app.use('/api', textRoutes)



// Start WebSocket
initWebSocket(server)

server.listen(port, () => {
  console.log(`People & Text Streamer API + WebSocket listening at http://localhost:${port}`)
})

