import mysql from 'mysql2/promise'

const config = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: 'jerastis100%MySQL',
  database: 'node_movies'
}

const connection = await mysql.createConnection(config)

const OFFSET = 4 // <-- Movies per page

export class MovieModel {

  static getAll = async ({ genre, page, offset = OFFSET }) => {
    const permitedCharsRegex = /[^a-z]/i
    if (permitedCharsRegex.test(genre)) {
      console.log(`Something is trying to inject SQL: ${genre}`)
      return []
    }

    // https://es.stackoverflow.com/a/522385/367138
    const moviesQuery = `
      WITH filter_movies AS (
        SELECT 
          BIN_TO_UUID(a.id) AS id,
          a.title,
          a.year,
          a.director,
          a.duration,
          a.poster,
          CAST( JSON_ARRAYAGG( LOWER(c.name) ) as JSON ) AS genre,
          a.rate
        FROM movie as a
        JOIN movie_genre as b 
          ON BIN_TO_UUID(a.id) = BIN_TO_UUID(b.movie_id)
        JOIN genre as c
          ON b.genre_id = c.id
        GROUP BY a.id
        ORDER BY a.id
      )
      SELECT * FROM filter_movies `

    const genreQuery = genre
      ? `WHERE JSON_CONTAINS(genre, '["${genre.toLowerCase()}"]')`
      : ''

    const pageQuery = page 
      ? `LIMIT ${(page - 1) * offset}, ${offset}` 
      : ''

    try {
      const [movies] = await connection.query(`
        ${ moviesQuery }
        ${ genreQuery }
        ${ pageQuery }
      `)

      return movies
    } 
    catch (error) {
      console.log(error.message)

      return []
    }

    /* OTHER SOLUTION

    const moviesQuery = `
      SELECT 
        BIN_TO_UUID(id) as id,
        title,
        year,
        director,
        duration,
        poster,
        rate 
      FROM movie`

    const genreMoviesQuery = genre 
      ? await (async () => {
          const [genres] = await connection.query(`
            SELECT 
              * 
            FROM genre 
            WHERE LOWER(name) = ?`, 
            [genre.toLowerCase()]
          )

          if (genres.length === 0) return ''

          const [{ id }] = genres

          const [genre_movies_id] = await connection.query(`
            SELECT 
              BIN_TO_UUID(movie_id) as movie_id 
            FROM movie_genre 
            WHERE genre_id = ?`, 
            [id]
          )

          return 'WHERE ' + genre_movies_id.map(movie => `BIN_TO_UUID(id) = '${movie.movie_id}'`).join(' OR ')
        })()
      : ''
      */
  }

  static getById = async ({ id }) => {
    try {
      const [[ movie ]] = await connection.query(
        `SELECT 
          BIN_TO_UUID(id) AS id, 
          title, 
          year, 
          director, 
          duration, 
          poster,
          rate 
        FROM movie
        WHERE BIN_TO_UUID(id) = ?`, 
        [id]
      )
      
      return movie
    } 
    catch (error) {
      return false
    }
  }

  static create = async ({ data }) => {
    const { title, year, director, duration, poster, rate, genre } = data

    try {
      // const id = crypto.randomUUID()
      const [[{ id }]] = await connection.query(`SELECT UUID() id;`)

      await connection.query(
        `INSERT INTO movie (
          id, 
          title, 
          year, 
          director, 
          duration, 
          poster,
          rate 
        ) VALUES
        (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?);`, 
        [id, title, year, director, duration, poster, rate]
      )
  
      genre.forEach(async gen => {
        await connection.query(
          `INSERT INTO movie_genre (
            movie_id, genre_id
          ) VALUES ( UUID_TO_BIN(?), (SELECT id FROM genre WHERE name = ?));`,
          [id, gen]
        )
      })
      
      return { id, ...data }
    } catch (error) {
      console.log(error.message)
      return false
    }

  }

  static update = async ({ id, data }) => {
    const [[ movie ]] = await connection.query(
      `SELECT 
        BIN_TO_UUID(id) AS id, 
        title, 
        year, 
        director, 
        duration, 
        poster,
        rate 
      FROM movie
      WHERE BIN_TO_UUID(id) = ?`, 
      [id]
    )
    
    if (!movie) return false

    

    return movie
  }

  static delete = async ({ id }) => {
    
  }

}
