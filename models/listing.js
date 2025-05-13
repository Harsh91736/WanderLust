const mongoose = require("mongoose");  // so we can create schema and model in this file
const review = require("./review");
const Schema = mongoose.Schema;  // so we can write Schema in place of mongoose.Schema
const Review = require("./review.js");

//creating a schema 
// this is a template on which duplicate will be generated of listings

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
    },
    image: {
        url: String,
        filename: String,
    },
    location: {
        type: String,
    },
    country: {
        type: String,
    },
    reviews : [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});


listingSchema.post("findOneAndDelete" , async (listing) =>{
    if(listing){
    await Review.deleteMany({_id : {$in : listing.reviews}});
    }
}) 

// creating a model

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;

