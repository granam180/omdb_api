const express = require("express");
const app = express();
const fetch = require("node-fetch");
app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res) {
  res.render("search");
});

//results?search=something 'key value pair'
app.get("/results", (req, res) => {
  var query = req.query.search;
  var url = "http://www.omdbapi.com/?s=" + query + "&apikey=thewdb";
// var urli = "http://www.omdbapi.com/?i=" + query + "&apikey=thewdb"; 

/**
 * the fetch function is used to make the API request, 
 * and the response is handled using Promises. 
 * If the API request is successful and the response contains data, 
 * it is passed to the results view (results.ejs). 
 * If there is an error or no data in the response, an empty object is passed to the view
 */

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data && data["Search"]) {
        res.render("results", { data: data });
        console.log(data)
      } else {
        res.render("results", { data: {} });
      }
    })
    .catch(error => {
      console.log(error);
      res.render("results", { data: {} });
    });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("MOVIE APP HAS STARTED!");
});
