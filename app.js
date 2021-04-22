var express = require("express");
var app= express();
var bodyParser = require("body-parser");
var mongoose= require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var Campground = require("./models/campgroung");
var Comment =require("./models/comment");
var User = require("./models/user");
 var seedDB = require("./seeds");
 
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");

//mongoose.connect("mongodb://localhost:27017/yelp_camp",{});
mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
console.log(__dirname);
app.use(methodOverride("_method"));
//seed the database
//seedDB();

//passport config
app.use(require("express-session")({
	secret:"once again rusty wins cutest dog",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});




app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes); 
	

//++++++++++++++++++++

//auth rout


app.listen(process.env.port||3500,function(req,res){
	console.log("server is running");
});