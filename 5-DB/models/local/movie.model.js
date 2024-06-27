import { randomUUID } from 'node:crypto'
import { readJSON } from '../../utils/readJSON.js'

const movies = readJSON('/database/local.json')

const OFFSET = 4 // <-- Movies per page

export class MovieModel {

  static getAll = async ({ genre, page, offset = OFFSET }) => {
    let filteredMovies = structuredClone(movies)

    if (genre) {
      filteredMovies = filteredMovies.filter(
        movie => movie.genre.some(movieGenre => movieGenre.toLowerCase() === genre.toLowerCase())
      )
    }

    if (page) {
      filteredMovies = filteredMovies.slice( (page - 1) * offset, (page - 1) * offset + offset ) 
    }

    return {
      ok: true,
      data: filteredMovies
    }
  }

  static getById = async ({ id }) => {
    const movie = movies.find(movie => movie.id === id)

    return movie 
    ? {
      ok: true,
      data: movie
    } : {
      ok: false,
      error: 'Movie not found'
    }
  }

  static create = async ({ data }) => {
    const newMovie = {
      id: randomUUID(),
      ...data
    }
  
    movies.push(newMovie)

    return {
      ok: true,
      data: newMovie
    }
  }

  static update = async ({ id, data }) => {
    const movieIndex = movies.findIndex(movie => movie.id === id)

    if (movieIndex === -1) {
      return {
        ok: false,
        error: 'Movie not found'
      }
    }
    
    const updatedMovie = { 
      ...movies[movieIndex], 
      ...data 
    }

    movies[movieIndex] = updatedMovie

    return {
      ok: true,
      data: updatedMovie
    }
  }

  static delete = async ({ id }) => {
    const movieIndex = movies.findIndex(movie => movie.id === id)

    if (movieIndex === -1) {
      return {
        ok: false,
        error: 'Movie not found'
      }
    }

    movies.splice(movieIndex, 1)

    return {
      ok: true,
      message: 'Movie deleted'
    }
  }

}
