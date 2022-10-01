// how to use mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const articleSchema = new Schema({
    id: Number, 
    title: String,
    content: String,
    votes: {
        upvotes: Number,
        downvotes: Number, 
        clicks: Number
    },
    author: String,
    time: Date,
});
const Article = mongoose.model('Article', articleSchema);
module.exports = Article;
    // dictionary of user ids and their votes
