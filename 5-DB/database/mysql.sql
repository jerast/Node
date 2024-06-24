DROP DATABASE IF EXISTS node_movies;

CREATE DATABASE node_movies;

USE node_movies;

CREATE TABLE movie (
  id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
  title VARCHAR(255) NOT NULL,
  year INT NOT NULL,
  director VARCHAR(255) NOT NULL,
  duration INT NOT NULL,
  poster TEXT,
  rate DECIMAL(2, 1) UNSIGNED NOT NULL
);

CREATE TABLE genre (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE movie_genre (
  movie_id BINARY(16) REFERENCES movie(id),
  genre_id INT REFERENCES genre(id),
  PRIMARY KEY (movie_id, genre_id)
);

INSERT INTO genre (name) VALUES
( 'Action' ),
( 'Adventure' ),
( 'Fantasy' ),
( 'Sci-Fi' ),
( 'Drama' ),
( 'Crime' ),
( 'Romance' ),
( 'Animation' ),
( 'Biography' );

INSERT INTO movie (id, title, year, director, duration, poster, rate) VALUES
( UUID_TO_BIN(UUID()), 'The Shawshank Redemption', 1994, 'Frank Darabont', 142, 'https://i.ebayimg.com/images/g/4goAAOSwMyBe7hnQ/s-l1200.webp', 9.3 ),
( UUID_TO_BIN(UUID()), 'The Dark Knight', 2008, 'Christopher Nolan', 152, 'https://i.ebayimg.com/images/g/yokAAOSw8w1YARbm/s-l1200.jpg', 9.0 ),
( UUID_TO_BIN(UUID()), 'Inception', 2010, 'Christopher Nolan', 148, 'https://m.media-amazon.com/images/I/91Rc8cAmnAL._AC_UF1000,1000_QL80_.jpg', 8.8 ),
( UUID_TO_BIN(UUID()), 'Pulp Fiction', 1994, 'Quentin Tarantino', 154, 'https://www.themoviedb.org/t/p/original/vQWk5YBFWF4bZaofAbv0tShwBvQ.jpg', 8.9 ),
( UUID_TO_BIN(UUID()), 'Forrest Gump', 1994, 'Robert Zemeckis', 142, 'https://i.ebayimg.com/images/g/qR8AAOSwkvRZzuMD/s-l1600.jpg', 8.8 ),
( UUID_TO_BIN(UUID()), 'Gladiator', 2000, 'Ridley Scott', 155, 'https://img.fruugo.com/product/0/60/14417600_max.jpg', 8.5 ),
( UUID_TO_BIN(UUID()), 'The Matrix', 1999, 'Lana Wachowski', 136, 'https://i.ebayimg.com/images/g/QFQAAOSwAQpfjaA6/s-l1200.jpg', 8.7 ),
( UUID_TO_BIN(UUID()), 'Interstellar', 2014, 'Christopher Nolan', 169, 'https://m.media-amazon.com/images/I/91obuWzA3XL._AC_UF1000,1000_QL80_.jpg', 8.6 ),
( UUID_TO_BIN(UUID()), 'The Lord of the Rings: The Return of the King', 2003, 'Peter Jackson', 201, 'https://i.ebayimg.com/images/g/0hoAAOSwe7peaMLW/s-l1600.jpg', 8.9 ),
( UUID_TO_BIN(UUID()), 'The Lion King', 1994, 'Roger Allers, Rob Minkoff', 88, 'https://m.media-amazon.com/images/I/81BMmrwSFOL._AC_UF1000,1000_QL80_.jpg', 8.5 ),
( UUID_TO_BIN(UUID()), 'The Avengers', 2012, 'Joss Whedon', 143, 'https://img.fruugo.com/product/7/41/14532417_max.jpg', 8.0 ),
( UUID_TO_BIN(UUID()), 'Jurassic Park', 1993, 'Steven Spielberg', 127, 'https://vice-press.com/cdn/shop/products/Jurassic-Park-Editions-poster-florey.jpg?v=1654518755&width=1024', 8.1 ),
( UUID_TO_BIN(UUID()), 'Titanic', 1997, 'James Cameron', 195, 'https://i.pinimg.com/originals/42/42/65/4242658e6f1b0d6322a4a93e0383108b.png', 7.8 ),
( UUID_TO_BIN(UUID()), 'The Social Network', 2010, 'David Fincher', 120, 'https://i.pinimg.com/originals/7e/37/b9/7e37b994b613e94cba64f307b1983e39.jpg', 7.7 ),
( UUID_TO_BIN(UUID()), 'Avatar', 2009, 'James Cameron', 162, 'https://i.etsystatic.com/35681979/r/il/dfe3ba/3957859451/il_fullxfull.3957859451_h27r.jpg', 7.8 );

INSERT INTO movie_genre (movie_id, genre_id) VALUES 
( (SELECT id FROM movie WHERE title = 'The Shawshank Redemption'), (SELECT id FROM genre WHERE name = 'Drama')),
( (SELECT id FROM movie WHERE title = 'The Dark Knight'), (SELECT id FROM genre WHERE name = 'Action')),
( (SELECT id FROM movie WHERE title = 'The Dark Knight'), (SELECT id FROM genre WHERE name = 'Crime')),
( (SELECT id FROM movie WHERE title = 'The Dark Knight'), (SELECT id FROM genre WHERE name = 'Drama')),
( (SELECT id FROM movie WHERE title = 'Inception'), (SELECT id FROM genre WHERE name = 'Action')),
( (SELECT id FROM movie WHERE title = 'Inception'), (SELECT id FROM genre WHERE name = 'Adventure')),
( (SELECT id FROM movie WHERE title = 'Inception'), (SELECT id FROM genre WHERE name = 'Sci-Fi')),
( (SELECT id FROM movie WHERE title = 'Pulp Fiction'), (SELECT id FROM genre WHERE name = 'Crime')),
( (SELECT id FROM movie WHERE title = 'Pulp Fiction'), (SELECT id FROM genre WHERE name = 'Drama')),
( (SELECT id FROM movie WHERE title = 'Forrest Gump'), (SELECT id FROM genre WHERE name = 'Drama')),
( (SELECT id FROM movie WHERE title = 'Forrest Gump'), (SELECT id FROM genre WHERE name = 'Romance')),
( (SELECT id FROM movie WHERE title = 'Gladiator'), (SELECT id FROM genre WHERE name = 'Action')),
( (SELECT id FROM movie WHERE title = 'Gladiator'), (SELECT id FROM genre WHERE name = 'Adventure')),
( (SELECT id FROM movie WHERE title = 'Gladiator'), (SELECT id FROM genre WHERE name = 'Drama')),
( (SELECT id FROM movie WHERE title = 'The Matrix'), (SELECT id FROM genre WHERE name = 'Action')),
( (SELECT id FROM movie WHERE title = 'The Matrix'), (SELECT id FROM genre WHERE name = 'Sci-Fi')),
( (SELECT id FROM movie WHERE title = 'Interstellar'), (SELECT id FROM genre WHERE name = 'Adventure')),
( (SELECT id FROM movie WHERE title = 'Interstellar'), (SELECT id FROM genre WHERE name = 'Drama')),
( (SELECT id FROM movie WHERE title = 'Interstellar'), (SELECT id FROM genre WHERE name = 'Sci-Fi')),
( (SELECT id FROM movie WHERE title = 'The Lord of the Rings: The Return of the King'), (SELECT id FROM genre WHERE name = 'Action')),
( (SELECT id FROM movie WHERE title = 'The Lord of the Rings: The Return of the King'), (SELECT id FROM genre WHERE name = 'Adventure')),
( (SELECT id FROM movie WHERE title = 'The Lord of the Rings: The Return of the King'), (SELECT id FROM genre WHERE name = 'Drama')),
( (SELECT id FROM movie WHERE title = 'The Lion King'), (SELECT id FROM genre WHERE name = 'Animation')),
( (SELECT id FROM movie WHERE title = 'The Lion King'), (SELECT id FROM genre WHERE name = 'Adventure')),
( (SELECT id FROM movie WHERE title = 'The Lion King'), (SELECT id FROM genre WHERE name = 'Drama')),
( (SELECT id FROM movie WHERE title = 'The Avengers'), (SELECT id FROM genre WHERE name = 'Action')),
( (SELECT id FROM movie WHERE title = 'The Avengers'), (SELECT id FROM genre WHERE name = 'Adventure')),
( (SELECT id FROM movie WHERE title = 'The Avengers'), (SELECT id FROM genre WHERE name = 'Sci-Fi')),
( (SELECT id FROM movie WHERE title = 'Jurassic Park'), (SELECT id FROM genre WHERE name = 'Adventure')),
( (SELECT id FROM movie WHERE title = 'Jurassic Park'), (SELECT id FROM genre WHERE name = 'Sci-Fi')),
( (SELECT id FROM movie WHERE title = 'Titanic'), (SELECT id FROM genre WHERE name = 'Drama')),
( (SELECT id FROM movie WHERE title = 'Titanic'), (SELECT id FROM genre WHERE name = 'Romance')),
( (SELECT id FROM movie WHERE title = 'The Social Network'), (SELECT id FROM genre WHERE name = 'Biography')),
( (SELECT id FROM movie WHERE title = 'The Social Network'), (SELECT id FROM genre WHERE name = 'Drama')),
( (SELECT id FROM movie WHERE title = 'Avatar'), (SELECT id FROM genre WHERE name = 'Action')),
( (SELECT id FROM movie WHERE title = 'Avatar'), (SELECT id FROM genre WHERE name = 'Adventure')),
( (SELECT id FROM movie WHERE title = 'Avatar'), (SELECT id FROM genre WHERE name = 'Fantasy'));
