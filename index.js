const express = require('express');
const path = require('path');

const app = express();
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// import article from './article.js';
const Article = require('./Article.js');
const User = require('./User.js');

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));
const mongoURL = "mongodb+srv://admin:adminadmin@cluster0.mz5u0n1.mongodb.net/?retryWrites=true&w=majority"
const mongoose = require('mongoose');
mongoose.connect(mongoURL, {useNewUrlParser: true, useUnifiedTopology: true, dbName: "HackMIT"}).then(() => {console.log("sucessfully connected to database")}).catch((err) => {console.log(err)});

async function verify(username, password) {
    const user = await User.findOne({ username: username });
    if (user && user.password === password) 
        return true;
    else 
        return false;
}

async function chargeUser(username, cost) {
	const user = await User.findOne({ username: username });
    if (!user) return false;
	if (user.coins < cost) return false;
	user.coins -= cost;
	user.save();
	return true;
}
async function verifyCookie() {
    let username = req.cookies.username;
    let password = req.cookies.password;
    const user = await User.findOne({ username: username });
    if (!user) return false;
    if (user.password === password) {
        // get date
        let date = new Date();
        let lastUpdate = user.lastUpdate;
        let sameDay = false;
        if (date.getDate() === lastUpdate.getDate() && date.getMonth() === lastUpdate.getMonth() && date.getFullYear() === lastUpdate.getFullYear()) 
            sameDay = true;
        if (!sameDay) {
            user.coins += 1;
            user.lastUpdate = date;
            user.save();
        }
        return true;
    }
    else return false;
}


async function postArticle(title, content, description) {
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

app.get("/api/login", (req, res) => {
    const match = verify(req.query.username, req.query.password);
    if (match) {
        res.cookie(`username`, res.query.username);
        res.cookie(`password`, res.query.password);
        res.send("Login successful");
    }
    else 
        res.send("Login failed");
});
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
        res.send("Created user successfully");
    }).catch((err) => {
        res.send("Failed to create user");
        console.log(err);
    });
});

/**
 * /api/getInfo:
​		Input: req.query.username
​		Output: {cost: number, lastUpdate: date, articles: [{article: Number, cost: Number, shared: Boolean}]}
 */
app.get('/api/getInfo', (req, res) => {
    User.findOne({username: req.query.username}).then((result) => {
        res.send({coins: result.coins, lastUpdate: result.lastUpdate, articles: result.articles});
    }).catch((err) => {
        console.log(err);
    });
});

/**
 * ​	/api/list:
 *     List all articles
​		Output: [{article: number, title: string, description: string, votes: {upvotes: number, downvotes: number, clicks: number}, author:string, time: date}]
 */

app.get("/api/list", (req, res) => {
    // find all articles
    Article.find().then((result) => {
        // for each, remove the content
        res.send(result.map((article) => {
            return {
                article: article.id,
                title: article.title,
                description: article.description, 
                votes: article.votes,
                author: article.author,
                time: article.time,
            }
        }));
    });
});

/** 
 * /api/post:
​		Input: req.query.title, req.query.content, req.query.description
​		Effect: will post the article
 */
app.get('/api/post', async (req, res) => {
    if (! await verifyCookie()) {
        res.send("Not logged in");
        return ;
    }
    await postArticle(req.query.title, req.query.content, req.query.description);
});

function haveAccess(user, article) { // user: a real user!
    for (history of user.articles) 
        if (history.article === article.id) 
            return true;
    return false;
}

/** /api/buy:
​		Input: req.query.id
​		Effect: will buy the article*/
app.get('/api/buy', async (req, res) => {
    if (! await verifyCookie()) {
        res.send("Not logged in");
        return ;
    }
    let user = await User.findOne({username: req.cookies.username});
    if (haveAccess(user, req.query.id)) {
        res.send("You already have access to this article");
        return ;
    }
    if (! await chargeUser(req.cookies.username, 1)) {
        res.send("Not enough coins");
        return ;
    }
    // append the new article
    user.articles.push({article: req.query.id, cost: 1, shared: false});
    user.save();
});
// /api/fetch:
// ​		Input: req.query.id
// ​		Output: {article: number, title: string,  description: string, **content: string**, votes: {upvotes: number, downvotes: number, clicks: number}, author:string, time: date}

app.get("/api/fetch", async (req, res) => {
    if (! await verifyCookie()) {
        res.send("Not logged in");
        return ;
    }
    let user = await User.findOne({username: req.cookies.username});
    if (! haveAccess(user, req.query.id)) {
        res.send("You don't have access to this article");
        return ;
    }
    let article = await fetchArticle(req.query.id);
    res.send({
        article: article.id,
        title: article.title,
        description: article.description,
        content: article.content,
        votes: article.votes,
        author: article.author,
        time: article.time,
    });
});



/** /api/share: */

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);
