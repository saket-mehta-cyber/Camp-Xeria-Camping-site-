var express               =require("express"),
    app                   =express(),
    bodyParser            =require("body-parser"),
    mongoose              =require('mongoose'),
    Campground            =require("./models/campground"),
    Comment               =require("./models/comment"),
	flash                 =require("connect-flash"),
    seedDB                =require("./seeds"),
	methodOverride        =require("method-override"),
	User                  =require("./models/user"),
    passport              =require("passport"),
    LocalStrategy         =require("passport-local"),
    passportLocalMongoose =require("passport-local-mongoose");

//requiring Routes
var commentRoutes  = require("./routes/comments"),
    campgoundRoutes= require("./routes/campgrounds"),
    indexRoutes     = require("./routes/index");

mongoose.connect('mongodb+srv://<user>:<password>@cluster0.iajwu.mongodb.net/<dbname>?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

// mongoose.connect('mongodb://localhost:27017/yelp_camp_v12', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useFindAndModify: false
// })
// .then(() => console.log('Connected to DB!'))
// .catch(error => console.log(error.message));

// seedDB();

app.use(bodyParser.urlencoded({ extended: true }))
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());


// PASSPORT CONFIGURATION =========

app.use(require("express-session")({
	secret: "chori ka kaam karega ye",
	resave :false,
	saveUninitialized: false	
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
	next();
})


app.use("/", indexRoutes);
app.use("/campgrounds", campgoundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(process.env.PORT || 3000,function(){
	console.log("yelp server started");
})