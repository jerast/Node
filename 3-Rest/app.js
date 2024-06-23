let movies = require('./movies.json')
const crypto = require('node:crypto')
const express = require('express')
const cors = require('cors')
const { validateMovie, valiedatePartialMovie } = require('./schemas/movies')

const app = express()
app.disable('x-powered-by') // desabilitar el header X-Powered-By: Express
app.disable('etag')
app.use(express.json())
app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      'http://localhost:8080',
      // 'http://192.168.0.13:8080',
    ]

    if (ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, true)
    }

    if (!origin) {
      return callback(null, true)
    }

    return callback(new Error('Not Allowed by CORS'))
  }
}))

// const ACCEPTED_ORIGINS = [
//   'http://locahost:8080',
//   'http://192.168.0.13:8080',
// ]

const MOVIES_PER_PAGE = 5

app.get('/movies', (request, response) => {
  // const { origin } = request.headers

  // if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
  //   response.header('Access-Control-Allow-Origin', origin)
  // }

  const { genre, page } = request.query

  let pagedMovies = page 
    ? movies.slice( page * MOVIES_PER_PAGE - MOVIES_PER_PAGE, page * MOVIES_PER_PAGE ) 
    : movies

  if (!genre) {
    return response.json(pagedMovies)
  }

  const filteredMovies = pagedMovies.filter(
    movie => movie.genre.some(movieGenre => movieGenre.toLowerCase() === genre.toLowerCase())
  )

  return response.json(filteredMovies)
})

app.get('/movies/:id', (request, response) => { // path-to-regex
  const { id } = request.params

  const movie = movies.find(movie => movie.id === id)

  if (!movie) {
    return response.status(404).json({ message: 'Movie not found' })
  }

  return response.json(movie)
})

app.post('/movies', (request, response) => {
  const result = validateMovie(request.body)

  if (result.error) {
    return response.status(422).json({ error: result.error.issues })
  }

  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data
  }

  // Esto no sería REST,
  // porque estamos guardando el estado de la aplicacion en memoria
  movies.push(newMovie)

  return response.status(201).json(newMovie)
})

app.patch('/movies/:id', (request, response) => {
  const result = valiedatePartialMovie(request.body)

  if (result.error) {
    return response.status(422).json({ error: result.error.issues })
  }

  const { id } = request.params
  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) {
    return response.status(404).json({ message: 'Movie not found' })
  }

  const updatedMovie = { ...movies[movieIndex], ...result.data }
  movies[movieIndex] = updatedMovie

  return response.json(updatedMovie)
})

app.delete('/movies/:id', (request, response) => {
  // const { origin } = request.headers

  // if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
  //   response.header('Access-Control-Allow-Origin', origin)
  // }

  const { id } = request.params
  const movie = movies.find(movie => movie.id === id)

  if (!movie) {
    return response.status(404).json({ message: 'Movie not found' })
  }

  movies = movies.filter(movie => movie.id !== id)

  return response.json({ deleted: movie, success: true })
})

// app.options('/movies/:id', (request, response) => {
//   const { origin } = request.headers

//   if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
//     response.header('Access-Control-Allow-Origin', origin)
//     response.header('Access-Control-Allow-Methods', 'DELETE')
//   }

//   response.send()
// })

const PORT = process.env.PORT ?? 3000
app.listen(PORT, () => console.log(`server listening on http://localhost:${PORT}`))
