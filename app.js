if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

// Database connection
const mongoose = require('mongoose');
const Listing = require("./models/listing.js");
const User = require("./models/user.js");

async function main() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    }
}

// Initialize database connection
main();

// Express setup
const express = require("express");
const app = express();
const port = 3000;

// Starting server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

console.log(process.env.SECRET)

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
const listingRouter = require("./routes/listing.js");


//requiring review
const reviewRouter = require("./routes/review.js");

//requiring user
const userRouter = require("./routes/user.js");

//requiring cookieparser
const cookieParser = require("cookie-parser");
app.use(cookieParser("secretcode"));

//requiring passport
const passport = require("passport");
const LocalStrategy = require("passport-local");

//requiring express setion
const session = require("express-session");

// Session configuration
const sessionOptions = {
    secret: process.env.SESSION_SECRET || "mysupersecretstring",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    },
};
// to use session
app.use(session(sessionOptions));


//requiring flash
const flash = require("connect-flash");
//use flash
app.use(flash());

//initialize passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req ,res ,next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demouser", async (req,res) =>{
//     let fakeUser = new User({
//         email: "harshdhameliya06@gmail.com",
//         username: "delta-student",
//     });

//     let registeredUser = await User.register(fakeUser , "helloworld");
//     res.send(registeredUser);
// });

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/" , userRouter);


// fage not found
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    const { statusCode = 500, message = "Something went Wrong!" } = err;
    res.status(statusCode).render("listings/error.ejs", { message });
});


