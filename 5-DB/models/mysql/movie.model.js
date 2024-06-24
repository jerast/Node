import mysql from 'mysql2/promise'

const config = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: 'jerastis100%MySQL',
  database: 'node_movies'
}

const connection = await mysql.createConnection(config)

const OFFSET = 5 // <-- Movies per page

export class MovieModel {

  static getAll = async ({ genre, page, offset = OFFSET }) => {
    let query = 'SELECT BIN_TO_UUID(id) AS id, title, year, director, duration, poster, rate FROM movie'

    const pageQuery = page 
      ? `LIMIT ${(page - 1) * offset}, ${offset}` 
      : ''
      
    const [ movies ] = await connection.query(`${query} ${pageQuery};`)
    const [ genres ] = await connection.query(`SELECT * FROM genre;`)
    const [ move_genres ] = await connection.query(`SELECT`)

    return movies
  }

  static getById = async ({ id }) => {
    
  }

  static create = async ({ data }) => {

  }

  static update = async ({ id, data }) => {
    
  }

  static delete = async ({ id }) => {
    
  }

}
