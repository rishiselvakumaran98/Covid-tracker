var express 		  = require("express"),
	mongoose 		    = require("mongoose"),
	bodyParser 		  = require("body-parser"),
	methodOverride  = require("method-override"),
	expressSantizer = require("express-sanitizer"),
	passport    	  = require("passport"),
	LocalStrategy   = require("passport-local"),
	Blog  			    = require("./models/blog"),
  Comment     	  = require("./models/comment"),
  User        	  = require("./models/user"),
  //seedDB     		  = require("./seed"),
  app 			      = express(),
  middleware      = require("./middleware/index"),
  cookieParser    = require("cookie-parser"),
  flash           = require("connect-flash"),
  session         = require("express-session");

// Need to configure dotenv
require('dotenv').config();


// Routing for the Schema models:
var commentRoutes    = require("./routes/comments"),
    blogRoutes 		 = require("./routes/blogs"),
    indexRoutes      = require("./routes/index");
    //topicRoutes     = require("./routes/topics");

// assign mongoose promise library and connect to database
mongoose.Promise = global.Promise;

const DBUri = process.env.MONGODB_URI || "mongodb://localhost:27017/cs_blog_post";

//APP CONFIG // Create a new DB to use APP
mongoose.connect(DBUri, {useNewUrlParser: true, useUnifiedTopology: true})
      .then(() => console.log(`Database connected!`))
      .catch(err => console.log(`Database connection error: ${err.message}`));


// App set and use Configuration

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSantizer());
app.use(cookieParser('secret'));
app.locals.moment = require('moment');
//seedDB();


// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "This Blog is the best!",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Let other JS pages have access to the current user
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// Set the routes for the Apps
app.use("/", indexRoutes);
//app.use("/blogs", topicRoutes);
app.use("/blogs", blogRoutes);
app.use("/blogs/:id/comments", commentRoutes);


//Setup app server for viewing
app.listen("3000", process.env.IP, function(){
	console.log("Yep server is connected");
});