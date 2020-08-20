var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User    = require("../models/user");

//root route
router.get("/", function(req, res){
    res.render("landing");
});

router.get("/about", function(req, res){
   res.render("about", {page: 'about'}); 
});

router.get("/prevention", function(req, res){
   res.render("prevention", {page: 'prevention'}); 
});

router.get("/treatment", function(req, res){
   res.render("treatment", {page: 'treatment'}); 
});

router.get("/latest-news", function(req, res){
   res.render("latest-news", {page: 'latest-news'}); 
});

// show register form
router.get("/register", function(req, res){
   res.render("register", {page: 'register'}); 
});

//handle sign up logic
router.post("/register", function(req, res){
  var newUser = new User({username: req.body.username});
  if(req.body.adminCode === process.env.ADMIN_CODE) {
    newUser.isAdmin = true;
  }
  User.register(newUser, req.body.password, function(err, user){
      if(err){
          console.log(err);
          return res.render("register", {error: err.message});
      }
      passport.authenticate("local")(req, res, function(){
         req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
         res.redirect("/blogs"); 
      });
  });
});

//show login form
router.get("/login", function(req, res){
   res.render("login", {page: 'login'}); 
});

//handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/blogs",
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: 'Welcome to Codebase!'
    }), function(req, res){
});

// logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Thanks, See you later!");
   res.redirect("/blogs");
});

module.exports = router;