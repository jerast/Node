import { randomUUID } from 'node:crypto'
import { readJSON } from '../../utils/readJSON.js'

const movies = readJSON('/database/local.json')

const OFFSET = 5 // <-- Movies per page

export class MovieModel {

  static getAll = async ({ genre, page, offset = OFFSET }) => {
    let filteredMovies = structuredClone(movies)

    if (page) {
      filteredMovies = filteredMovies.slice( (page - 1) * offset, (page - 1) * offset + offset ) 
    }

    if (genre) {
      filteredMovies = filteredMovies.filter(
        movie => movie.genre.some(movieGenre => movieGenre.toLowerCase() === genre.toLowerCase())
      )
    }

    return filteredMovies
  }

  static getById = async ({ id }) => {
    const movie = movies.find(movie => movie.id === id)

    return movie
  }

  static create = async ({ data }) => {
    const newMovie = {
      id: randomUUID(),
      ...data
    }
  
    movies.push(newMovie)

    return newMovie
  }

  static update = async ({ id, data }) => {
    const movieIndex = movies.findIndex(movie => movie.id === id)

    if (movieIndex === -1) return false

    const updatedMovie = { 
      ...movies[movieIndex], 
      ...data 
    }

    movies[movieIndex] = updatedMovie

    return updatedMovie
  }

  static delete = async ({ id }) => {
    const movieIndex = movies.findIndex(movie => movie.id === id)

    if (movieIndex === -1) return false

    movies.splice(movieIndex, 1)
    return true
  }

}
