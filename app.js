const express = require("express");
const app = express();
// request deprecated
// const request = require("request");
const axios = require("axios");
const path = require('path');
// const fetch = require("node-fetch");
require('dotenv').config();

app.use(express.static(path.join(__dirname, 'public'))) // dirname refers to the directory that this script is running

app.set("view engine", "ejs");  // sends rendered view of `/views` to the client
app.set('views', path.join(__dirname, '/views'))

// SEARCH!
app.get("/", function(req, res) {
    res.render("search"); //search.ejs
	// res.send("This is the search page!"); //search.ejs
});

// ALL RESULTS!

// app.get("/results", (req, res) => { //results?search=something 'key value pair'
    // res.send("Hello, it works!");
    // const query = (req.query.search); //search req(uest)
    // const url = "http://www.omdbapi.com/?s=" + query + "&apikey=" + process.env.OMDB_API_KEY;
    // const urli = "http://www.omdbapi.com/?i=" + query + "&apikey=" + process.env.OMDB_API_KEY;

	// ***** NPM REQUEST DEPRECIATED!!
	// *******************************
    // request(url, (error, response, body) => {
    //     if(!error && response.statusCode == 200) {
    //         const data = JSON.parse(body);
    //         //res.send(data["Search"][3]["Title"]);
    //         res.render("results", {data: data}); //results.ejs
    //     } else {
	// 		res.render("/results")
	// 	}
    // });
    app.get("/results", async (req, res) => {
        const query = req.query.search;
        
        const url = `http://www.omdbapi.com/?s=${query}&apikey=${process.env.OMDB_API_KEY}`;
      
        try {
          const response = await axios.get(url);
          const data = response.data;

          /**
           * another API request is made for each movie using its imdbID 
           * `http://www.omdbapi.com/?i=${imdbID}` instead of `?s=${imdbID}`
           * The complete movie details are then added to the movieDetails array. 
           * Finally, the results.ejs template is rendered with the movieDetails 
           * array as the data parameter
          */
      
          if (data.Response === "True") {
          /**
          * If the API response indicates that the search was successful 
          * (data.Response === "True"), it retrieves the movie details by 
          * making individual API requests for each movie using their IMDb ID.
          */
            const movies = data.Search || [];
            const movieDetails = [];
      
            for (const movie of movies) {
              const imdbID = movie.imdbID;
              const movieUrl = `http://www.omdbapi.com/?i=${imdbID}&apikey=${process.env.OMDB_API_KEY}`;
              const movieResponse = await axios.get(movieUrl);
              const movieData = movieResponse.data;
              movieDetails.push(movieData);
            }
      
            res.render("results", { data: movieDetails });
          } else {
            res.render("results", { data: [] });
          }
        } catch (error) {
          res.render("results", { data: [] });
        }
      });
      


app.listen(3000, () => {
	console.log("MOVIE APP HAS STARTED!");
});

/** DEPLOYING TO HEROKU
 *  
 * Create a Procfile -- needed by Heroku to declare what command should be executed to start the app
 * heroku login
 * heroku create
 * git init
 * heroku git:remote -a omdb-api
 * git add .
 * git commit -am "inital commit"
 * git push heroku master
 * 
 * Check for error `heroku logs --tail`
 * 
 */
