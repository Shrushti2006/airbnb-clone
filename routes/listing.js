const express=require("express");
const Listing=require("../models/listing.js");
const {listingSchema}=require("../schema.js");
const listingControllers=require("../controllers/listing.js")
const warpAsync= require("../utils/warpAsync.js");
const ExpressError= require("../utils/ExpressError.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const router=express.Router();
const multer=require("multer");
const {storage }=require("../cloudConfig.js");
const upload=multer({storage});


//----------index get route+add new listing post routes-------
router
.route("/listing")
.get(warpAsync(listingControllers.index))
.post(   isLoggedIn,  upload.single('listing[image]'), validateListing,warpAsync(listingControllers.addNewListing));

//-------------------new route-----------------

router.get("/listing/new", isLoggedIn, (req, res)=>{
     
    res.render("listings/new.ejs");

});

router
.route("/filters/:type").get(warpAsync(listingControllers.filtersByType))
router
.route("/filter/:country").get(warpAsync(listingControllers.filtersByCountry))



//--------------------edit route----------

router.get("/listing/:id/edit", isLoggedIn, isOwner ,listingControllers.renderEditForm);

//----edit put route+show route+delete route---------

router.route("/listing/:id")
.get(listingControllers.showListings)
.put(isLoggedIn, isOwner,upload.single('listing[image]'), listingControllers.upadateListing)
.delete( isLoggedIn, isOwner ,listingControllers.destroyListing);








module.exports=router;



