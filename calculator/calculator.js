const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;


//getting the values from request-body-parser

app.use(bodyParser.urlencoded({ extended: true }));

// app.get("/", function (req, res) {
//   res.send("Hello world");
// });

// app.get("/about", function (req, res) {
//   res.send("About");
// });

app.get("/", function (req, res) {
  console.log(__dirname);
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  console.log(req.body);

  var num1=Number(req.body.num1);
  var num2=Number(req.body.num2);
  var result=num1+num2;

  res.send("Results : "+result);
});



//BMI calculator
app.get("/bmicalculator", function (req, res) {
  res.sendFile(__dirname + "/bmiCalculator.html");
});


app.post("/bmiCalculator",function(req,res){
    var weight=Number(req.body.weight);
    var height=Number(req.body.height);
    var bmi=weight/(height*height);

    console.log("Calculated bmi : "+bmi);
    res.send("Calculated bmi : "+bmi);
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
