const express = require("express");

const app = express();

const port = 3000;

app.get("/", function (request, response) {
  //   console.log(request);
        response.send("Heelllo");
});

app.get("/contact",function(req,res){
res.send("Contact me");
});

app.get("/about",function(req,res){
    res.send("About");
});

app.get("/hobbies", function (req, res) {
  res.send("About");
});

app.listen(port, () => {
  console.log("Example app listening at http://localhost:"+port);
});

