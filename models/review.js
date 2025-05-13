const mongoose = require("mongoose");  // so we can create schema and model in this file
const Schema = mongoose.Schema;  // so we can write Schema in place of mongoose.Schema


const reviewSchema = new Schema({
    comment: String,
    rating: {
        type : Number,
        min : 1,
        max : 5
    },
    createdAt : {
        type : Date,
        default : Date.now(),
    },
    author :{
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

module.exports = mongoose.model("Review", reviewSchema);