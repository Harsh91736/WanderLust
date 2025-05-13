// things required for express

const express = require("express");
const app = express();
const port = 3000;
// starting server
app.listen(port, () => [
    console.log(`Server is running on port ${port}`)
])


// this is set path to join views folder
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// this line is use to parse the data which will come in form of req
app.use(express.urlencoded({ extended: true }));

// this to use method override function
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

// requireing ejs-mate
const ejsMate = require("ejs-mate");
app.engine('ejs', ejsMate);


//public folder is use to share the static file 
app.use(express.static(path.join(__dirname, "public")));


//things related to database

const Listing = require("./models/listing.js");  //we are using template created in listing.js
const mongoose = require('mongoose');


// require listing schema
const { listingSchema, reviewSchema } = require("./schema.js");

// requiring the wrapAsync file
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const { wrap } = require("module");

// require review schema
const Review = require("./models/review.js");
const { warn } = require("console");

//requiring listings
const listings = require("./routes/listing.js");


//requiring review
const reviews = require("./routes/review.js");

//requiring cookieparser
const cookieParser = require("cookie-parser");
app.use(cookieParser("secretcode"));

//requiring express setion
const session = require("express-session");


//requiring flash
const flash = require("connect-flash");

main()
    .then(() => {
        console.log("connection successfull");
    })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

//session
const sessionOptions = {secret : "mysupersecretstring" , resave: false, saveUninitialized: true};

app.use(session(sessionOptions));
app.use(flash());
//middleware for flash
app.use((req , res , next) =>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
})

app.get("/register" , (req,res) =>{
    let {name = "Raj"} = req.query;
    // console.log(req.session);
    req.session.name = name;
    console.log(req.session.name);
    if(name === "Raj"){
        req.flash("error" , "user not registered");
    }else{
        req.flash("success" , "user registered successfully!");
    }
    // res.send(name);
    res.redirect("/hello");

});

app.get("/hello" , (req,res) =>{
    // res.send(`hello , ${req.session.name}`);
    // res.render("page.ejs", {name: req.session.name , msg: req.flash("success")});
    // res.locals.successMsg = req.flash("success");
    // res.locals.errorMsg = req.flash("error");
    res.render("page.ejs", {name: req.session.name });
});

// app.get("/reqcount" , (req,res) =>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count = 1;
//     }
//     res.send(`You sent a request ${req.session.count} times`);
// })

app.get("/test", (req,res) =>{
    res.send("session is working");
})


//signed cookie

// app.get("/getsignedcookie" , (req,res)=>{
//     res.cookie("made-in","India",{signed: true});
//     res.send("signed cookie sent");
// });


// app.get("/verify" ,(req,res)=>{
//     console.log(req.signedCookies);
//     res.send("cookie verified");
// });


// //cookies
// app.get("/getcookies", (req, res) => {
//     res.cookie("greet", "namaste");
//     res.cookie("madeIN", "India");
//     res.send("cookies are set");
// });

// app.get("/greet" , (req,res) =>{
//     let {name = "anonymous"} = req.cookies;
//     res.send(`Hi, ${name} `);
// });

// // root page

// app.get("/", (req, res) => {
//     console.dir(req.cookies);
//     res.send("Hi, i am root");
// });

