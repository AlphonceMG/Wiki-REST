const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:51690/wikiDB", { useNewUrlParser: true });

mongoose.connect(connectionURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const articleSchema = mongoose.Schema({
    title: String,
    content: String
});
const Article = mongoose.model("Article", articleSchema);

app.route("/articles")

.get(function(req, res) {
        Article.find({}, null, { timeout: 30000 })
            .then(findArticles => {
                console.log(findArticles);
                res.send(findArticles);
            })
            .catch(err => {
                console.log(err);
                res.status(500).send("Error retrieving articles: " + err);
            });
    })
    .post(function(req, res) {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });

        newArticle.save(function(err) {
            if (!err) {
                res.send("Added a new article");
            } else {
                res.status(500).send("Error adding a new article: " + err);
            }
        });
    });

// app.delete("/articles", function(req, res) {
//     Article.deleteMany({}).then(() => {
//         res.send("Successfully deleted all articles");
//     }).catch((error) => {
//         res.status(500).send("Error deleting articles")
//     });
// });

app.route("/articles/:articleTitle")

.get(function(req, res) {
    Article.findOne({ title: req.params.articleTitle }).then(findArticle => {
            console.log(findArticle);
            res.send(findArticle);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send("Error retrieving article: " + err);
        });
});
app.listen("3000", function(req, res) {
    console.log("server running on port 3000");
});