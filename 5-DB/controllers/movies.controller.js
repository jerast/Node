import { validateMovie, valiedatePartialMovie } from '../schemas/movies.js'

export class MovieController {

  constructor ({ movieModel }) {
    this.movieModel = movieModel
  }

  getAll = async (request, response) => {
    const { genre, page } = request.query
    
    const movies = await this.movieModel.getAll({ genre, page })
  
    return response.status(movies.ok ? 200 : 404).json(movies)
  }

  getById = async (request, response) => {
    const { id } = request.params
  
    const movie = await this.movieModel.getById({ id })
  
    return response.status(movie.ok ? 200 : 404).json(movie)
  }

  create = async (request, response) => {
    const result = validateMovie(request.body)
  
    if (result.error) {
      return response.status(422).json({ error: result.error.issues })
    }
  
    const newMovie = await this.movieModel.create({ data: result.data })
  
    return response.status(newMovie.ok ? 200 : 404).json(newMovie)
  }

  update = async (request, response) => {
    const result = valiedatePartialMovie(request.body)
  
    if (result.error) {
      return response.status(422).json({ error: result.error.issues })
    }
  
    const { id } = request.params
  
    const updatedMovie = await this.movieModel.update({ id, data: result.data })
  
    return response.status(updatedMovie.ok ? 200 : 404).json(updatedMovie)
  }

  delete = async (request, response) => {
    const { id } = request.params
    
    const movie = await this.movieModel.delete({ id })
  
    return movie.ok
      ? response.json(movie) 
      : response.status(404).json(movie)
  }

}