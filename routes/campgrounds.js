var express     =require("express"),
    router      = express.Router(),
	Campground  =require("../models/campground"),
    middleware  =require("../middleware");
// INDEX ROUTE === campgrounds page 

router.get("/",function(req,res){
	
	Campground.find({},function(err,allcampgrounds){
		if(err){
			console.log(err);
		}
		else{
				res.render("campgrounds/index",{campgrounds:allcampgrounds});
		}
	})

})

// CREATE route -- to post form page

router.post("/",middleware.isLoggedIn,function(req,res){
	
	var name=req.body.name;
	var image = req.body.image;
	var desc= req.body.description;
	var author={
		id : req.user._id,
		username: req.user.username
	}
	var newCampground={name :name , image:image , description:desc , author:author}
	
	Campground.create(newCampground,function(err,newlycreated){
		if(err){
			console.log(err);
		}
		else{
				res.redirect("/campgrounds");
		}
	})
	
})
// NEW route === to get form page

router.get("/new",middleware.isLoggedIn,function(req,res){
	
	res.render("campgrounds/new");

})
// SHOW ROUTE == more info about one campground
router.get("/:id",function(req,res){
	
	//find the campground with provided provided
	Campground.findById(req.params.id).populate("comments").exec( function(err,foundcampground){
		if(err){
			console.log(err);
		}
		else{
				//render show template with that campground
			
	
	             res.render("campgrounds/show", {campground:foundcampground});
		}
	})
	})

// Edit campground route
router.get("/:id/edit" ,middleware.checkCampgroundOwnership, function(req,res){
	Campground.findById(req.params.id , function(err,foundcampground){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.render("campgrounds/edit" , {campground:foundcampground});
		}
	})
	
	
})

// Update campground route
router.put("/:id",middleware.checkCampgroundOwnership ,function(req,res){
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		}else{
			req.flash("success", "campground updated!");
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
})

//DestroY Campground Route

router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndRemove(req.params.id ,function(err){
		if(err){
			res.redirect("/campgrounds");
		}else{
			req.flash("success", "campground Deleted!");
			res.redirect("/campgrounds");
		}
	});
	
});

 

module.exports= router;
