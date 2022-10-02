const express = require('express');
const path = require('path');
const CryptoJS = require("crypto-js");
const cors = require("cors");


const app = express();
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(
	cors({
		origin: '*'
	})
);

app.use(express.json());

// import article from './article.js';
const Article = require('./Article.js');
const User = require('./User.js');

// Serve the static files from the React app
//app.use(express.static(path.join(__dirname, 'client/build')));
const mongoURL = "mongodb+srv://admin:adminadmin@cluster0.mz5u0n1.mongodb.net/?retryWrites=true&w=majority"
const mongoose = require('mongoose');
const { get } = require('http');
mongoose.connect(mongoURL, {useNewUrlParser: true, useUnifiedTopology: true, dbName: "HackMIT"}).then(() => {console.log("sucessfully connected to database")}).catch((err) => {console.log(err)});

async function verify(username, password) {
    const user = await User.findOne({ username: username });
    if (!user) return false;
    if (user.password == password) 
        return true;
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
async function verifyCookie(req) {
    //console.log(req);
    let username = req.query.loginname;
    let password = req.query.password;
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


async function postArticle(req, title, content, description, type) {
    const newId = Math.floor(Math.random() * 1000000);
    const author = req.query.loginname;
	const article = new Article({
		id: newId,
		title: title,
		content: content,
        description: description, 
		votes: {
			upvotes: 0,
			downvotes: 0,
			clicks: 0,
		},
		author: author,
        time: new Date(),
        type: type
	});
	article
		.save()
		.then((result) => {
			console.log(result);
		})
		.catch((err) => {
			console.log(err);
		});
    const user = await User.findOne({ username: author });
    user.articles.push({article: newId, cost: -1, shared: true});
    user.save();
}

async function fetchArticle(id) {
	const article = await Article.findOne({ id: id });
	return article;
}

app.get("/api/login", async (req, res) => {
    const match = await verify(req.query.username, req.query.password);
    if (match) {
        res.cookie(`username`, req.query.username);
        res.cookie(`password`, req.query.password);
        res.send("Login successful");
    }
    else 
        res.send("Login failed");
});
// create a user

app.get('/api/createUser', async (req, res) => {
    // generate a random number
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
        articles: [], 
        lastUpdate: new Date(),
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
​		Output: [{article: number, title: string, description: string, votes: {upvotes: number, downvotes: number, clicks: number}, author:string, time: date, type: string}]
 */

app.get("/api/list", (req, res) => {
    if (!verifyCookie(req)) {
        res.send("Please log in!");
        return ;
    }
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
                type: article.type,            
            }
        }));
    });
});

/** 
 * /api/post:
​		Input: req.body.title, req.body.content, req.body.description, req.body.type
​		Effect: will post the article
 */
app.post('/api/post', async (req, res) => {

    // get body of request
    const title = req.body.title;
    if (! await verifyCookie(req)) {
        res.send("Not logged in");
        return ;
    }
    const result = req.body;
    await postArticle(req, result.title, result.content, result.description, result.type);
});

function getAccess(user, article) {
    for (history of user.articles)
		if (history.article == article) 
            return history;
    return null;
}
function haveAccess(user, article) { // user: a real user!
    if (getAccess(user, article) === null) return false;
    return true;
}

/** /api/buy:
​		Input: req.query.id
​		Effect: will buy the article*/
app.get('/api/buy', async (req, res) => {
    if (! await verifyCookie(req)) {
        res.send("Not logged in");
        return ;
    }
    let user = await User.findOne({username: req.query.loginname});
    console.log("NOW ");
    if (haveAccess(user, req.query.id)) {
        res.send("You already have access to this article");
        return ;
    }
    if (! await chargeUser(req.query.loginname, 1)) {
        res.send("Not enough coins");
        console.log("money ");
        return ;
    }

    console.log("Bought ");
    // append the new article
    user.articles.push({article: req.query.id, cost: 1, shared: false});
    user.save();
    res.send('successully bought');
});
// /api/fetch:
// ​		Input: req.query.id
// ​		Output: {article: number, title: string,  description: string, **content: string**, votes: {upvotes: number, downvotes: number, clicks: number}, author:string, time: date, type: string}

app.get("/api/fetch", async (req, res) => {
    console.log("FETCH", req.query);
    if (! await verifyCookie(req)) {
        res.send("Not logged in");
        console.log("NOT LOGGED IN");
        return ;
    }
    let user = await User.findOne({username: req.query.loginname});
    if (! haveAccess(user, req.query.id)) {
        res.send("You don't have access to this article");
        console.log("NO access");
        return ;
    }
    let article = await fetchArticle(req.query.id);
    console.log("success");
    res.send({
        article: article.id,
        title: article.title,
        description: article.description,
        content: article.content,
        votes: article.votes,
        author: article.author,
        time: article.time,
        type: article.type,
    });
});

// /api/retrieve: 
// ​		Input: req.query.username (the one who gives you gift), req.query.article (article id), req.query.hash (the hash of (password+id))
// ​		Output: Give you the access. 

app.get("/api/retrieve", async (req, res) => {
    if (! await verifyCookie(req)) {
        res.send("Not logged in");
        return ;
    }
    let user = await User.findOne({username: req.query.username});
    let receiver = await User.findOne({username: req.query.loginname});
    if (haveAccess(receiver, req.query.article)) {
        res.send("You already have access to this article");
        return ;
    }
    if (! user) {
        res.send("No such user");
        return ;
    }
    let id = req.query.article;
    if (CryptoJS.MD5(user.password + id) !== req.query.hash) {
		res.send("Wrong hash");
		return;
	}
    let history = getAccess(user, id);
    if (history === null) {
        res.send("The sender doesn't have access to this article");
        return ;
    }
    if (history.shared) {
        res.send("It has been shared");
        return ;
    }
    history.shared = true;
    user.save();
    receiver.articles.push({article: id, cost: 0, shared: true});
    receiver.save();
    res.send("Success");
});

/**
 * /api/vote:
​		Input: req.query.vote: +-1, req.query.id: article to vote
 */
app.get("/api/vote", async (req, res) => {
    if (! await verifyCookie(req)) {
        res.send("Not logged in");
        return ;
    }
    let user = await User.findOne({username: req.query.loginname});
    const history = getAccess(user, req.query.id);
    if (!history === null)  {
        res.send("You don't have access to this article");
        return ;
    }
    if (history.cost >= 2) {
        res.send("You have already voted");
        return ;
    }
    if (history.cost < 0) {
        res.send("You are the author");
        return ;
    }
    const article = await fetchArticle(req.query.id);
    if (req.query.vote == 1) 
        article.votes.upvotes++;
    else if (req.query.vote == -1) 
        article.votes.downvotes++;
    chargeUser(article.author, -history.cost);
    history.cost = 2;
    user.save();
});




/** /api/share: */

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});


const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);
