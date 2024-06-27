import express from 'express'
import { corsMiddleware } from './middlewares/cors.js'
import { moviesRoutes } from './routes/movies.routes.js'

export const createApp = ({ movieModel }) => {
  const app = express()

  // disables
  app.disable('x-powered-by')
  app.disable('etag')

  // middlewares
  app.use(express.json())
  app.use(corsMiddleware())

  // endpoints
  app.use('/movies', moviesRoutes({ movieModel }))

  // run server
  const PORT = process.env.PORT ?? 3000
  app.listen(PORT, () => {
    console.log(`server listening on http://localhost:${PORT}`)
  })
}
  