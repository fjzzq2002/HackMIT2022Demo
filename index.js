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

app.use(express.json({limit: '50mb'}));

// import article from './article.js';
const Article = require('./Article.js');
const User = require('./User.js');

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));
const mongoURL = "mongodb+srv://admin:adminadmin@cluster0.mz5u0n1.mongodb.net/?retryWrites=true&w=majority"
const mongoose = require('mongoose');
const { get } = require('http');
mongoose.connect(mongoURL, {useNewUrlParser: true, useUnifiedTopology: true, dbName: "HackMIT"}).then(() => {console.log("sucessfully connected to database")}).catch((err) => {console.log(err)});

async function verify(username, password) {
    try {
        const user = await User.findOne({ username: username });
        if (!user) return false;
        if (user.password == password) 
            return true;
        return false;
    }
    catch (err) {
        console.log(err);
        return false;
    }
}

async function chargeUser(username, cost) {
    try {
        const user = await User.findOne({ username: username });
        if (!user) return false;
        if (user.coins < cost) return false;
        user.coins -= cost;
        user.save();
        return true;
    }
    catch (err) {
        console.log(err);
        return false;
    }
}
async function verifyCookie(req) {
    //console.log(req);
    try {
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
    catch (err) {
        console.log(err);
        return false;
    }
}


async function postArticle(res, req, title, content, description, type) {
    try {    
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
        res.send(""+newId);
    }
    catch (err) {
        console.log(err);
    }
}

async function fetchArticle(id) {
    try {
        const article = await Article.findOne({ id: id });
        return article;
    }
    catch (err) {
        console.log(err);
    }
}

app.get("/api/login", async (req, res) => {
    try {
        const match = await verify(req.query.username, req.query.password);
        if (match) {
            res.cookie(`username`, req.query.username);
            res.cookie(`password`, req.query.password);
            res.send("Login successful");
        }
        else 
            res.send("Login failed");
    }
    catch (err) {
        console.log(err);
    }
});
// create a user

app.get('/api/createUser', async (req, res) => {
    // generate a random number
    // check if the username exists
    try {
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
    }
    catch (err) {
        console.log(err);
    }
});

/**
 * /api/getInfo:
​		Input: req.query.username
​		Output: {cost: number, lastUpdate: date, articles: [{article: Number, cost: Number, shared: Boolean}]}
 */
app.get('/api/getInfo', async (req, res) => {
    try {
        let result = await User.findOne({ username: req.query.username });
            
        res.send({
            coins: result.coins,
            lastUpdate: result.lastUpdate,
            articles: result.articles,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).send("No such user");
    }
});

/**
 * ​	/api/list:
 *     List all articles
​		Output: [{article: number, title: string, description: string, votes: {upvotes: number, downvotes: number, clicks: number}, author:string, time: date, type: string}]
 */

app.get("/api/list", async (req, res) => {
    try {
        // find all articles
        let result = await Article.find();
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
    } catch (err) {
        console.log(err);
        res.status(500).send("Error");
    }
});

/** 
 * /api/post:
​		Input: req.body.title, req.body.content, req.body.description, req.body.type
​		Effect: will post the article
 */
app.post('/api/post', async (req, res) => {

    // get body of request
    try {
        const title = req.body.title;
        if (! await verifyCookie(req)) {
            res.send("Not logged in");
            return ;
        }
        const result = req.body;
        return await postArticle(res, req, result.title, result.content, result.description, result.type);
    }
    catch (err) {
        console.log("Failed to post article");
        console.log(err);
    }
});

function getAccess(user, article) {
    try {
        for (history of user.articles)
            if (history.article == article) 
                return history;
        return null;
    }
    catch (err) {
        console.log(err);
        return null;
    }
}
function haveAccess(user, article) { // user: a real user!
    if (getAccess(user, article) === null) return false;
    return true;
}

/** /api/buy:
​		Input: req.query.id
​		Effect: will buy the article*/
app.get('/api/buy', async (req, res) => {
    try {
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

        let article = await Article.findOne({ id: req.query.id });
        let cost = 1;
        // if (article.votes.clicks < 1) cost = 0;
        // article.votes.clicks += 1;
        // article.save();
        if (! await chargeUser(req.query.loginname, cost)) {
            res.send("Not enough coins");
            console.log("money ");
            return ;
        }
        console.log("Bought ");
        user.articles.push({article: req.query.id, cost: 1, shared: false});
        user.save();
        res.send('successully bought');
    } catch (err) {
        console.log(err);
    }
});
// /api/fetch:
// ​		Input: req.query.id
// ​		Output: {article: number, title: string,  description: string, **content: string**, votes: {upvotes: number, downvotes: number, clicks: number}, author:string, time: date, type: string}

app.get("/api/fetch", async (req, res) => {
    try {
        console.log("FETCH", req.query);
        let article = await fetchArticle(req.query.id);
        if(article==null) {
            res.send({
                reason: "Article not found.",
            });
            return ;
        }
        let reason='';
        if (! await verifyCookie(req)) {
            reason="Not logged in.";
        }
        else {
            let user = await User.findOne({username: req.query.loginname});
            if (! haveAccess(user, req.query.id)) {
                if (article.votes.clicks < 1) {
                    article.votes.clicks += 1;
                    article.save();
                    user.articles.push({
						article: req.query.id,
						cost: 1,
						shared: false,
					});
					user.save();
                    reason="You don't have access to this article. But it's free !";
                    console.log("FREE");
                }
                else reason="You don't have access to this article.";
            }
        }
        if(reason!='') article.content='';
        res.send({
            article: article.id,
            title: article.title,
            description: article.description,
            content: article.content,
            votes: article.votes,
            author: article.author,
            time: article.time,
            type: article.type,
            reason: reason,
        });
    } catch (err) {
        console.log(err);
    }
});

// /api/retrieve: 
// ​		Input: req.query.username (the one who gives you gift), req.query.article (article id), req.query.hash (the hash of (password+id))
// ​		Output: Give you the access. 

app.get("/api/retrieve", async (req, res) => {
    try {
        if (! await verifyCookie(req)) {
            res.send("Not logged in");
            return ;
        }
        console.log("RETRIEVE", req.query);
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
        if (CryptoJS.MD5(user.password + id) != req.query.hash) {
            console.log("WRONG HASH");
            res.send("Wrong hash");
            return;
        }
        let history = getAccess(user, id);
        if (history == null) {
            res.send("The sender doesn't have access to this article");
            return ;
        }
        if (history.shared != false) {
            res.send("It has been shared");
            return ;
        }
        history.shared = true;
        user.save();
        receiver.articles.push({article: id, cost: 0, shared: true});
        receiver.save();
        res.send("Success");
    }
    catch (err) {
        console.log(err);
    }
});

/**
 * /api/vote:
​		Input: req.query.vote: +-1, req.query.id: article to vote
 */
app.get("/api/vote", async (req, res) => {
    try {
        if (! await verifyCookie(req)) {
            res.send("Not logged in");
            return ;
        }
        let user = await User.findOne({username: req.query.loginname});
        const history = getAccess(user, req.query.id);
        if (!history)  {
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
        article.save();
        if (req.query.vote == 1) 
            chargeUser(article.author, -history.cost);
        res.send(""+history.cost);
        history.cost = 2;
        if (req.query.vote == -1)
            history.cost = 3;
        user.save();
    }
    catch (err) {
        console.log(err);
    }   
});




/** /api/share: */

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    try {
        res.sendFile(path.join(__dirname+'/client/build/index.html'));
    }
    catch (err) {
        console.log(err);
    }
});


require('dotenv').config();

var fs = require('fs');
var http = require('http');
var https = require('https');

if(process.env.USEHTTPS) {
    // https://stackoverflow.com/a/38525463
    // https://itnext.io/node-express-letsencrypt-generate-a-free-ssl-certificate-and-run-an-https-server-in-5-minutes-a730fbe528ca
    const privateKey = fs.readFileSync('/etc/letsencrypt/live/beaverdam.top/privkey.pem', 'utf8');
    const certificate = fs.readFileSync('/etc/letsencrypt/live/beaverdam.top/cert.pem', 'utf8');
    const ca = fs.readFileSync('/etc/letsencrypt/live/beaverdam.top/chain.pem', 'utf8');
    var options = {
      key: privateKey,
      cert: certificate,
      ca: ca,
      requestCert: false,
      rejectUnauthorized: false
    }
    var server = https.createServer(options, app);
    server.listen(443, () => {
      console.log("Server listening on 443 (https)");
    });
    const httpServer = http.Server(app);
    httpServer.listen(80, () => {
      console.log("Server listening on 80 (http)");
    });
}
else {
    const port = process.env.PORT || 5000;
    app.listen(port);
    console.log('App is listening on port ' + port);
}
