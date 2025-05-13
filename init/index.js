const mongoose = require('mongoose');
const initData = require("./newdata.js");
const Listing = require("../models/listing.js");  


main()
    .then(() => {
        console.log("connection successfull");
    })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

// we will delete old data and insert new data

const initDB = async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) =>({...obj, owner: "67990d93f47441cb28c3886b"}));
    await Listing.insertMany(initData.data);
    console.log("DB initialized");
};

initDB();

