const express = require("express");
const { write } = require("fs");
const bodyParser = require("body-parser");

const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

const port = 3000;

// for making get request
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");

  // res.send("Hello");
});

app.post("/", function (req, res) {
  console.log(req.body.cityName);

  var query = req.body.cityName;
  var apikey = "546cd91c969e11a19a1b0f2ad7724cfd";
  var units = "metric";
  var url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&appid=" +
    apikey +
    "&units=" +
    units;
  https.get(url, function (response) {
    console.log(response);
    console.log("///////////////////////////////");

    response.on("data", function (data) {
      //for json
      var weatherData = JSON.parse(data);
      var weather = weatherData.main.temp;
      var weatherDescription = weatherData.weather[0].description;
      var icon = weatherData.weather[0].icon;

      var iconLink = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

      // send can be done only once

      res.write("<p>Weather description " + weatherDescription + "</p>");
      res.write("<h1>The weather is " + weather + "</h1>");
      res.write("<img src=" + iconLink + " >");
      res.send();
      console.log(weatherData);
    //   res.send(`<>`);
    });
  });
});

app.listen(port, function () {
  console.log(`Server is running on port http://localhost:${port}`);
});
