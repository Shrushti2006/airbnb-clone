const User = require("../models/user.js");

module.exports.signUpForm=(req, res) =>{
    res.render("users/signup.ejs");
}

module.exports.signUpUser=async (req, res, next) => {
    try{
       const { username, email, password } = req.body;
        const newUser = new User({ username, email });
         const registeredUser = await User.register(newUser, password);
         req.logIn(registeredUser, (err)=>{
           if(err){
            return next(err);
           }
             req.flash("success" ,"welcome to Wanderlust!");
        res.redirect("/listing");
         })
      
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

module.exports.loginForm=(req, res) => {
    res.render("users/login.ejs");
}

module,exports.loginUser=(req, res) => {
    req.flash("success", "Welcome back to Wanderlast!");
     let redirectUrl=res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);
}

module.exports.logOutUser= async(req,res)=>{
    req.logOut((err)=>{
      if(err){
       return next(err);
    }
        req.flash("success", "You are logged Out now!");
        res.redirect("/listing");
    });
}