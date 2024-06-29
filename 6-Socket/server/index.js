import express from 'express'
import logger from 'morgan'
import dotenv from 'dotenv'
import { Server } from 'socket.io'
import { createServer} from 'node:http'
import { createClient } from '@libsql/client'

dotenv.config();

const app = express()
const server = createServer(app)
const io = new Server( server, /* { connectionStateRecovery: {} } */ )

const db = createClient({
  url: process.env.SOCKET_TURSODB_URL,
  authToken: process.env.SOCKET_TURSODB_TOKEN
})

await db.execute(`DROP TABLE IF EXISTS messages`)
await db.execute(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user INTEGER,
    content TEXT
  )
`)

io.on('connection', async (socket) => {
  console.log(`User ${socket.handshake.auth.user} has benn connected!`)

  socket.on('disconnect', () => {
    console.log(`an ${socket.handshake.auth.user} has disconnected!`)
  })

  socket.on('chat message', async (message) => {
    try {
      const result = await db.execute({
        sql: 'INSERT INTO messages (user, content) VALUES (:user, :content)',
        args: message
      })

      io.emit('chat message', { 
        id: result.lastInsertRowid.toString(), 
        ...message 
      })
    } 
    catch (error) {
      console.error(error)
    }
  })

  if (!socket.recovered) {
    try {
      const results = await db.execute({
        sql: 'SELECT id, user, content FROM messages WHERE id > ?',
        args: [socket.handshake.auth.serverOffset ?? 0]
      })

      results.rows.forEach(message => {
        socket.emit('chat message', message)
      })
    } 
    catch (error) {
      console.log(error)
    }
  }
})

app.use(logger('dev'))

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/client/index.html')
})

const SOCKET_PORT = process.env.SOCKET_PORT ?? 1234

server.listen(SOCKET_PORT, () => {
  console.log(`Server is running on  http://localhost:${SOCKET_PORT}`)
})
