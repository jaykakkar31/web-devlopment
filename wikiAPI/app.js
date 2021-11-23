const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const express = require("express");
const ejs = require("ejs");

const port = 3000;
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/WikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const articlesSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", articlesSchema);
// app.use(express.static("public"));

// For ejs all ejs gonalook inside the view folder
app.set("view engine", "ejs");

app.use(express.static("public"));

const article1 = new Article({
  title: "REST",
  content:
    "REST is short for REpresentational State Transfer. IIt's an architectural style for designing APIs.",
});

const article2 = new Article({
  title: "API",
  content:
    "API stands for Application Programming Interface. It is a set of subroutine definitions, communication protocols, and tools for building software. In general terms, it is a set of clearly defined methods of communication among various components. A good API makes it easier to develop a computer program by providing all the building blocks, which are then put together by the programmer.",
});

const defaultArray = [article1, article2];

// Article.insertMany(defaultArray,function(err,callback){
//     console.log("inserted");
// });

app
  .route("/articles")

  .get(function (req, res) {
    Article.find(function (err, list) {
      if (!err) {
        res.send(list);
      } else {
        console.log(err);
      }
    });
  })

  .post(function (req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle.save(function (err) {
      if (err) {
        console.log(err);
      } else {
        res.send("saved Data");
      }
    });
  })

  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send("successfully deleted");
      } else {
        console.log(err);
      }
    });
  });

app
  .route("/articles/:title")
  .get(function (req, res) {
    const articleTitle = req.params.title;
    Article.findOne({ title: articleTitle }, function (err, article) {
      if (!err) {
        res.send(article);
      }
    });
  })

  .put(function (req, res) {
    Article.update(
      { title: req.params.title },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      function (err) {
        if (!err) {
          res.send("Successfully updated");
        }
      }
    );
  })
  .patch(function(req,res){
    Article.update({title:req.params.title},{$set:req.body},function(err){

      if(!err){
        console.log(req.body);
        res.send("Successfully updated")
      }
    })
  })

app.listen(port, function () {
  console.log(`server listens at http://localhost:${port}`);
});
