import express from 'express'
import moviesRoutes from './routes/movies.routes.js'
import { corsMiddleware } from './middlewares/cors.js'

const app = express()

app.disable('x-powered-by')
app.disable('etag')

app.use(express.json())
app.use(corsMiddleware())

app.use('/movies', moviesRoutes)

const PORT = process.env.PORT ?? 3000

app.listen(PORT, () => {
  console.log(`server listening on http://localhost:${PORT}`)
})
  