const express=require("express");
const Listing=require("../models/listing.js");
const Review=require("../models/review");
const {reviewSchema}=require("../schema.js");
const warpAsync= require("../utils/warpAsync.js");
const ExpressError= require("../utils/ExpressError.js");
const router=express.Router({mergeParams: true});
const {isLoggedIn, isReviewAuthor , validateReview}= require("../middleware.js");
const reviewControllers=require("../controllers/review.js")

//-------------------reviews route--------

router.post("/reviews" ,isLoggedIn, validateReview, (reviewControllers.createReview));

//------------review delete-------------
router.delete("/review/:reviewId",isLoggedIn,isReviewAuthor, warpAsync(reviewControllers.deleteReview));

module.exports=router;