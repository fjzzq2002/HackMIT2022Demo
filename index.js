const express = require('express');
const path = require('path');

const app = express();

// import article from './article.js';
const Article = require('./Article.js');
const User = require('./User.js');

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));
const mongoURL = "mongodb+srv://admin:adminadmin@cluster0.mz5u0n1.mongodb.net/?retryWrites=true&w=majority"
const mongoose = require('mongoose');
mongoose.connect(mongoURL, {useNewUrlParser: true, useUnifiedTopology: true, dbName: "HackMIT"}).then(() => {console.log("sucessfully connected to database")}).catch((err) => {console.log(err)});

async function postArticle(title, content, author) {
	const article = new Article({
		id: Math.floor(Math.random() * 1000000),
		title: title,
		content: content,
		votes: {
			upvotes: 0,
			downvotes: 0,
			clicks: 0,
		},
		author: author,
	});
	article
		.save()
		.then((result) => {
			console.log(result);
		})
		.catch((err) => {
			console.log(err);
		});
	return article;
}

async function fetchArticle(id) {
	const article = await Article.findOne({ id: id });
	return article;
}
// create a user

app.get('/api/createUser', async (req, res) => {
    //generate a random number
    // check if the username exists
    const result = await User.findOne({username: req.query.username});
    if (result) {
        res.send("username already exists");
        return ;
    }
    const user = new User({
        username: req.query.username,
        password: req.query.password,
        coins: 1,
        articles: []
    });
    user.save().then((result) => {
        res.send(result);
    }).catch((err) => {
        console.log(err);
    });
});

// get a user
app.get('/api/getUser', (req, res) => {
    User.findOne({username: req.query.username}).then((result) => {
        res.send(result);
    }).catch((err) => {
        console.log(err);
    });
});

// An api endpoint that returns a short list of items
app.get('/api/getList', (req,res) => {
    var list = ["item1", "item2", "item3"];
    res.json(list);
    console.log('Sent list of items');
});

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);