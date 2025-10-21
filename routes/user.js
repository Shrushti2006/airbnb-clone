const express = require("express");
const passport = require("passport");
const User = require("../models/user.js");
const warpAsync = require("../utils/warpAsync.js");
const router = express.Router();
const {isLoggedIn } = require("../middleware.js");
const localstrategy=require("passport-local");
const {saveRedirectUrl} = require("../middleware.js");
passport.use(new localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const userControllers=require("../controllers/user.js")


// ---------------- Signup Form (GET)  (POST)----------------
router.route("/signUp")
.get( userControllers.signUpForm)
.post( warpAsync(userControllers.signUpUser));



// ---------------- Login Form (GET)  (POST) ----------------
router.route("/login")
.get( userControllers.loginForm)
.post(
  saveRedirectUrl,
   passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userControllers.loginUser
);



//----------------Log out---------
router.get("/logout" ,userControllers.logOutUser)

module.exports = router;
