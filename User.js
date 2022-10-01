// how to use mongoose
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
    username: String, 
    password: String,
    coins: Number, 
    articles: [{article: Number, cost: Number, shared: Boolean}],
});
const User = mongoose.model("User", userSchema);
module.exports = User;
