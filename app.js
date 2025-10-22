if (process.env.NODE_ENV !== "production") {
    require('dotenv').config(); // Load .env file
}

const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const flash = require('connect-flash');
const session = require("express-session");
const MongoStore = require('connect-mongo');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const app = express();

// --- EJS Setup ---
app.engine('ejs', ejsMate);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// --- Middleware ---
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// --- MongoDB & Session Store ---
const db_url = process.env.ATLASDB_URL;

// MongoStore with proper error logging
const store = MongoStore.create({
    mongoUrl: db_url,
    crypto: { secret:process.env.SECRET },
    touchAfter: 24 * 3600 // seconds
});

store.on("error", (err) => {
    console.error("Mongo Store Error:", err);
});

// Session configuration
const sessionOptions = {
    store,
    secret:process.env.SECRET  ,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000
    }
};

app.use(session(sessionOptions));
app.use(flash());

// --- Passport Setup ---
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// --- Flash messages & currUser middleware ---
app.use((req, res, next) => {
    res.locals.Successmessage = req.flash("success") || null;
    res.locals.Errormessage = req.flash("error") || null;
    res.locals.currUser = req.user || null; // always defined
    next();
});

// --- Routes ---
app.get("/demo", async (req, res) => {
    const fakeUser = new User({
        email: "rutu@123",
        username: "Ruturaj Bhoite"
    });
    const registeredUser = await User.register(fakeUser, "rutuuuu");
    res.send(registeredUser);
});



app.use("/", listingRouter);
app.use("/listing/:id", reviewRouter);
app.use("/", userRouter);

// --- Error handling ---
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { err });
});

// --- MongoDB Connection ---
async function main() {
    try {
        await mongoose.connect(db_url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connection successful!");
    } catch (err) {
        console.error("MongoDB connection error:", err);
    }
}

// --- Start Server ---
const port = 8080;
main().then(() => {
    app.listen(port, () => {
        console.log(`App is listening on port ${port}`);
    });
});
