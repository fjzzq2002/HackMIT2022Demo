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