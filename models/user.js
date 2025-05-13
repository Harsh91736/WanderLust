const { required } = require("joi");
const mongoose = require("mongoose");  // so we can create schema and model in this file
const Schema = mongoose.Schema;  // so we can write Schema in place of mongoose.Schema
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
});

userSchema.plugin(passportLocalMongoose); // it will implement username hassing salting and password

module.exports = mongoose.model('User', userSchema);