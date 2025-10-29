const mongoose = require('mongoose')

let userschema = new mongoose.Schema({
    username : { type: String, required: true },
    email : { type: String, required: true, unique: true },
    password : { type: String, required: true }
})

let user = mongoose.model("users", userschema)
module.exports = user