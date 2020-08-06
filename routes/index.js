var express     =require("express"),
    router      =express.Router(),
	passport    =require("passport"),
	User        =require("../models/user");

// root route--home page

router.get("/",function(req,res){
	res.render("landing");
	
})


//===============
// Auth Routes
//===============

// register- show sign up form
router.get("/register", function(req, res){
   res.render("register"); 
});

//handle sign up logic
router.post("/register", function(req, res){
   var newUser= new User({ username: req.body.username});
   User.register(newUser, req.body.password ,function(err,user){
	       if(err){
      				req.flash("error", err.message);
      				return res.redirect("/register");
    }
	   passport.authenticate("local")(req,res,function(){
		   req.flash("success", "Welcome to CampXeria " + user.username + "!");
		   res.redirect("/campgrounds");
	   })
   })
});
//=============
// LOGIN ROUTES
//=============
//show login form
router.get("/login", function(req, res){
   res.render("login"); 
});

// handling login logic
    router.post("/login", function (req, res, next) {
      passport.authenticate("local",
        {
          successRedirect: "/campgrounds",
          failureRedirect: "/login",
          failureFlash: "Password or username is incorrect! OR Account doesn't exist! ",
          successFlash: "Welcome to CampXeria, " + req.body.username + "!"
        })(req, res);
    });

//logout route
router.get("/logout", function(req, res){
    req.logout();
	req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});




module.exports= router;

