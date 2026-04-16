const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const movieModel = require('./movie-model.js');


const app = express();

// Parse urlencoded bodies
app.use(bodyParser.json()); 

// Serve static content in directory 'files'
app.use(express.static(path.join(__dirname, 'files')));

/* Task 1.2: Add a GET /genres endpoint:
   This endpoint returns a sorted array of all the genres of the movies
   that are currently in the movie model.
*/

app.get('/genres', function (req, res) {
  const movies = Object.values(movieModel)    //need to transform JSON to JS Object first
  const genres = new Set();             //Automatically looks for uniqueness
  movies.forEach((movie) => {
    movie.Genres.forEach((genre) => {
      genres.add(genre);
    })
  })
  res.send(Array.from(genres));                   //transform it back
})

/* Task 1.4: Extend the GET /movies endpoint:
   When a query parameter for a specific genre is given, 
   return only movies that have the given genre
 */
// Configure a 'get' endpoint for all movies..
app.get('/movies', function (req, res) {
  const genre = req.query.Genres
  const movieArray = Object.values(movieModel); //Object.values() grabs all values ad places it into an Array

  if (movieArray.length < 1) {
    return res.sendStatus(404);
  }else if (genre){
    const filteredMovies = movieArray.filter(movie => movie.Genres.includes(genre))
    return res.send(filteredMovies);
  }
  res.send(movieArray);
})

// Configure a 'get' endpoint for a specific movie
app.get('/movies/:imdbID', function (req, res) {

  const movie = movieModel[req.params.imdbID];
  if (movie == null) {
    return res.sendStatus(404);
  }
  res.send(movie);
})

app.put('/movies/:imdbID', function (req, res) {
  if(movieModel[req.params.imdbID] == null) {
    movieModel[req.params.imdbID] = req.body;
    return res.sendStatus(201);
  }
  movieModel[req.params.imdbID] = req.body;
  res.sendStatus(200);
})

app.listen(3000)

console.log("Server now listening on http://localhost:3000/")
