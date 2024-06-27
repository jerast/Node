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
    if ((/[^-a-z]/i).test(genre)) {
      console.log(`Something is trying to inject SQL at Movies.getAll: `, genre)

      return {
        ok: true,
        data: []
      }
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
          CAST(JSON_ARRAYAGG( LOWER(c.name) ) AS JSON) AS genre,
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
        ${ pageQuery };
      `)

      return {
        ok: true,
        data: movies
      }
    } 
    catch (error) {
      console.log('Something failed at Movies.getAll: ', error.message)

      return {
        ok: false,
        error: 'Something goes wrong'
      }
    }
  }

  static getById = async ({ id }) => {
    try {
      const [[ movie ]] = await connection.query(`
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
        SELECT * FROM filter_movies
        WHERE id = ?
        `, [id]
      )
      
      return movie 
      ? {
        ok: true,
        data: movie
      } : {
        ok: false,
        error: 'Movie not found'
      }
    } 
    catch (error) {
      console.log(error)

      return {
        ok: false,
        error: 'Something goes wrong'
      }
    }
  }

  static create = async ({ data }) => {
    const { title, year, director, duration, poster, rate, genre } = data

    try {
      // const [[{ id }]] = await connection.query(`SELECT UUID() id;`)
      const id = crypto.randomUUID()

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

      const movie_genre_query = genre.map(gen => 
        `( UUID_TO_BIN('${id}'), (SELECT id FROM genre WHERE name = ?) )`
      ).join(',')

      await connection.query(
        `INSERT INTO movie_genre (
          movie_id, genre_id
        ) VALUES ${movie_genre_query};`,
        genre
      )
      
      return {
        ok: true,
        data: { id, ...data }
      }
    } 
    catch (error) {
      console.log(error)

      return {
        ok: false,
        error: 'Something goes wrong'
      }
    }

  }

  static update = async ({ id, data }) => {
    try {
      const { title, year, director, duration, poster, rate, genre } = data

      const [result] = await connection.query(`
        UPDATE movie 
        SET 
          title = IFNULL(?, title),
          year = IFNULL(?, year),
          director = IFNULL(?, director),
          duration = IFNULL(?, duration),
          poster = IFNULL(?, poster),
          rate = IFNULL(?, rate)
        WHERE BIN_TO_UUID(id) = ?;
      `, [title, year, director, duration, poster, rate, id]);
      
      if (result.affectedRows === 0) {
        return {
          ok: false,
          error: 'Movie not found'
        }
      }

      const [[ updatedMovie ]] = await connection.query(
        `SELECT 
          BIN_TO_UUID(id) AS id, 
          title, 
          year, 
          director, 
          duration, 
          poster,
          rate 
        FROM movie
        WHERE BIN_TO_UUID(id) = ?;
        `, [id]
      )

      return {
        ok: true,
        data: updatedMovie
      }
    } 
    catch (error) {
      console.log(error)

      return {
        ok: false,
        error: 'Something goes wrong'
      }
    }
  }

  static delete = async ({ id }) => {  
    try {
      const [movieResult] = await connection.query(
        'DELETE FROM movie WHERE BIN_TO_UUID(id) = ?'
      , [id]);

      if (movieResult.affectedRows === 0) {
        return {
          ok: false,
          error: 'Movie not found'
        }
      }

      const [movieGenresResult] = await connection.query(
        'DELETE FROM movie_genre WHERE BIN_TO_UUID(movie_id) = ?'
      , [id]);
      
      if (movieGenresResult.affectedRows === 0) {
        return {
          ok: false,
          error: 'Something goes wrong'
        }
      }

      return {
        ok: true,
        message: 'Movie deleted'
      }
    } 
    catch (error) {
      console.log(error)

      return {
        ok: false,
        error: 'Something goes wrong'
      }
    }
  }

}
