var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campgroung");
var Comment = require("../models/comment"); 
var middleware = require("../middleware");

router.get("/new",middleware.isLoggedIn,function(req,res){
	console.log(req.params.id);
	Campground.findById(req.params.id, function(err, campground){
		
		if(err){
			console.log(err);
		}else{res.render("comments/new",{campground: campground});
			 }
	});	
	
		});
router.post("/",middleware.isLoggedIn,function(req,res){
	Campground.findById(req.params.id, function(err,campground){
		if(err){
			console.log(err);
			res.redirect("/compgrounds"); 
		}else{
		Comment.create(req.body.comment, function(err, comment){
			if(err){
				cosole.log(err);
			}else{
				//add ueser name and id
				comment.author.id=req.user._id;
				comment.author.username=req.user.username;
				//save comment
				comment.save();
				campground.comments.push(comment);
				campground.save();
				console.log(comment);
				res.redirect('/campgrounds/'+ campground._id);
			}
		});
		}
	});
});
//comments edit rout
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
	Comment.findById(req.params.comment_id,function(err, foundComment){
		if(err){
			res.redirect("back");
		}else{res.render("comments/edit",{campground_id: req.params.id,comment: foundComment });
	}
	});
});
//comment update
router.put("/:comment_id", function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComments){
		if(err){
			res.redirect("back");
		}else{res.redirect("/campgrounds/"+req.params.id)};
	});
});
//comment destroy
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id,function(err){
		if(err){
		res.redirect("back");
	    }else{  res.redirect("/campgrounds/"+req.params.id);
             }
   });
});




module.exports = router;