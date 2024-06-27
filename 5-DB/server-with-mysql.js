import { createApp } from './app.js'
import { MovieModel } from './models/mysql/movie.model.js'

createApp({ movieModel: MovieModel })