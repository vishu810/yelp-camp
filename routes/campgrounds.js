var express = require("express");
var router = express.Router();
var Campground = require("../models/campgroung");
var middleware = require("../middleware");

router.get("/",function(req,res){
	
	Campground.find({},function(err,allcampgrounds){
		if(err){
			console.log("err");
		}else{res.render("campgrounds/index",{campgrounds:allcampgrounds});
			
		}
	});


});

router.post("/",middleware.isLoggedIn,function(req,res){
	var name = req.body.name;
	var image= req.body.image;
	var desc= req.body.description;
	var author={
		id:req.user._id,
		username:req.user.username
	}
	var newcampground= {name:name, image:image,description:desc,author:author}
	
Campground.create(newcampground,function(err,newlycreated){
	if(err){
		console.log(err);
		
	}else{
		console.log(newlycreated);
		res.redirect("/campgrounds");	
	}
});	
});

router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("campgrounds/new");
});

router.get("/:id",function(req,res){
      Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		  if(err){
			  
			  console.log(err);
		  }else{
			  console.log(foundCampground);
			  res.render("campgrounds/show.ejs",{campground:foundCampground});
				
			   } });	
	});

//update
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){

	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds/"+ req.params.id);
		}
	});
});

// edit
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){		
		Campground.findById(req.params.id, function(err, foundCampground){
	res.render("campgrounds/edit",{campground:foundCampground});
	});
});

//destroy c destroy
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;