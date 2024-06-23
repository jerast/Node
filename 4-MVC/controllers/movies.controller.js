import { MovieModel } from '../models/movie.model.js'
import { validateMovie, valiedatePartialMovie } from '../schemas/movies.js'

export class MovieController {

  static getAll = async (request, response) => {
    const { genre, page } = request.query
    
    const movies = await MovieModel.getAll({ genre, page })
  
    return response.json(movies)
  }

  static getById = async (request, response) => {
    const { id } = request.params
  
    const movie = await MovieModel.getById({ id })
  
    return movie 
      ? response.json(movie) 
      : response.status(404).json({ message: 'Movie not found' })
  }

  static create = async (request, response) => {
    const result = validateMovie(request.body)
  
    if (result.error) {
      return response.status(422).json({ error: result.error.issues })
    }
  
    const newMovie = await MovieModel.create({ data: result.data })
  
    return response.status(201).json(newMovie)
  }

  static update = async (request, response) => {
    const result = valiedatePartialMovie(request.body)
  
    if (result.error) {
      return response.status(422).json({ error: result.error.issues })
    }
  
    const { id } = request.params
  
    const updatedMovie = await MovieModel.update({ id, data: result.data })
  
    return updatedMovie 
      ? response.json(updatedMovie)
      : response.status(404).json({ message: 'Movie not found' })
  }

  static delete = async (request, response) => {
    const { id } = request.params
    
    const movie = await MovieModel.delete({ id })
  
    return movie 
      ? response.json({ ok: true }) 
      : response.status(404).json({ ok: false, message: 'Movie not found' })
  }

}