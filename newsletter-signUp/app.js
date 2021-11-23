const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const https = require("https");

const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signUp.html");
  // res.send("Hello ");
});

app.post("/", function (req, res) {
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var email = req.body.email;

  console.log(firstName);
  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };
  console.log(data.members);
  var JSONdata = JSON.stringify(data);
  console.log(data);
  //   console.log(req.body);
  var url = "https://us1.api.mailchimp.com/3.0/lists/e323a1fb1d";
  var options = {
    method: "POST",
    auth: "jay:fc9e7629cde480cb2719ae2bbe047454-us1",
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      // res.send("successfully subscribed");
      res.sendFile(__dirname+"/success.html")
    }else{
      res.sendFile(__dirname+"/failure.html");
    }
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });
  request.write(JSONdata);
  request.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

// api key
// fc9e7629cde480cb2719ae2bbe047454-us1
// list id
// e323a1fb1d

app.listen(port, function () {
  console.log(`Server is running on port http://localhost:${port}`);
});
