const Listing= require("../models/listing.js");
const {listingSchema}=require("../schema.js");

module.exports.index= async(req, res)=>{
    
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}

    
module.exports.filtersByType = async (req, res) => {
  
    const { type } = req.params; // e.g. "mountain", "tranding", "cities", "pools"
    // console.log("Param type received:", type);

    const filteredListings = await Listing.find({ type });
    // console.log("Found listings:", filteredListings.length);
    // console.log(filteredListings);

    res.render("listings/index.ejs", { allListings: filteredListings });

};
module.exports.filtersByCountry = async (req, res) => {
  
    const { country } = req.params; 

    const filteredListings = await Listing.find({ country });
   

    res.render("listings/index.ejs", { allListings: filteredListings });

};



//------------new-----------
module.exports.renderNewForm=(req, res)=>{
       res.render("listings/new.ejs");

}

module.exports.addNewListing=async (req, res) => {

    const listingLocation  = req.body.listing.location;
  
  
    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(listingLocation)}`
    );
    const geoData = await geoRes.json();
   

    if (!geoData.length) {
      console.log("⚠️ Location not found for:", listingLocation);
      req.flash("error", "Location not found. Please enter a valid location.");
      return res.redirect("/listing/new");
   
  }
    const lat = parseFloat(geoData[0].lat);
    const lon = parseFloat(geoData[0].lon);

       let url =req.file.path;
       let filename=req.file.filename;
      
       let newListing = new Listing(req.body.listing);
       newListing.image= { url, filename};
        newListing.owner=req.user._id;
        newListing.geometry = {
        type: "Point",
      coordinates: [lon, lat] 
    };
   

       let saved=  await newListing.save();
  
        req.flash("success" ,"New Listing Created");
        res.redirect("/listing");
}

//------------edit-----------
module.exports.renderEditForm =async(req, res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id);
    let originalImageUrl=listing.image.url;
   originalImageUrl=originalImageUrl.replace("/upload", "/upload/h_300,w_250");
    res.render("listings/edit.ejs", {listing, originalImageUrl, showFooter:true});
    
}

module.exports.upadateListing=async(req, res)=>{
       let {id}=req.params;
      let listing=await Listing.findByIdAndUpdate(id, {...req.body.listing} , { new: true });
       
      if(typeof(req.file) !== "undefined"){
        let url =req.file.path;
       let filename=req.file.filename;
       listing.image={ url, filename};
       await listing.save();
      }
      
       
       req.flash("success" ," Listing Upadate Successfully!");
       res.redirect(`/listing/${id}`);
}

//-----------------show---------
module.exports.showListings= async(req, res)=>{
   let {id}= req.params;
   let listing= await Listing.findById(id)
   .populate({path :"reviews",
     populate:{
        path:"author",
     },
    })
    .populate("owner");


   if(!listing){
    req.flash("error" ,"You are searching for not exitsing listing");
      res.redirect("/listing");
   }else
   {
       res.render("listings/show.ejs", {listing ,hideFooter: true });

   }
   
}

//---------------delete---------
module.exports.destroyListing= async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
    req.flash("success" ," Listing Deleted!");
  res.redirect("/listing");
};