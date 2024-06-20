const dittoJSON = require('./pokemon/ditto.json')
const express = require('express')

const PORT = process.env.PORT ?? 3000

const app = express()
app.disable('x-powered-by')

// middleware / interceptores
app.use((req, res, next) => {
  console.log('mi primer middleware')

  // trackear la request a la base de datos
  // revisar el token del usuario

  next()
})

app.use(express.json())
/* app.use((req, res, next) => {
  if (req.method !== 'POST') return next()
  if (req.headers['content-type'] !== 'application/json') return next()

  let body = ''

  req.on('data', chunk => {
    body += chunk.toString()
  })

  req.on('end', () => {
    const data = JSON.parse(body)
    req.body = data
    next()
  })
}) */

// endpoints
app.get('/', (req, res) => {
  res.json({ message: 'hola mundo' })
})

app.get('/pokemon/ditto', (req, res) => {
  res.json(dittoJSON)
})

app.post('/pokemon', (req, res) => {
  res.status(201).json(req.body)
})

// not found
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' })
})

// run server
app.listen(PORT, () => {
  console.log(`server listening on http://localhost:${PORT}`)
})
