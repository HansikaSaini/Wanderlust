const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken =process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});

module.exports.index = async(req,res)=>{
    const allListings =await Listing.find({});
      res.render("./listings/index.ejs",{allListings});
    };

module.exports.renderNewForm = async(req,res)=>{
           res.render("listings/new.ejs");
        };

module.exports.showListing =async(req,res)=>{
            let {id}=req.params;
                const listing = await Listing.findById(id)
                .populate({
                 path:"reviews",
                 populate:{
                   path:"author",
                 },
                })
                .populate("owner"); 
                if(!listing){
                 req.flash("error","Listing you requested for does not exist!");
                 res.redirect("/listings");
                }
                console.log(listing);
                res.render("listings/show.ejs",{listing});
         };

module.exports.createListing = async(req,res,next)=>{
   let response =await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1
  })
    .send();
            let url = req.file.path;
            let filename = req.file.filename;
            const  newListing= new Listing(req.body.listing);
            newListing.owner = req.user._id;
            newListing.image ={url,filename};

            newListing.geometry = response.body.features[0].geometry;

           let savedListing= await newListing.save();
           console.log(savedListing);
            req.flash("success","New listing created!");
            res.redirect("/listings");
          
          };

module.exports.renderEditForm =async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error","Listing you requested for does not exist!");
      res.redirect("/listings");
     }

     let originalIamgeUrl = listing.image.url;
     originalIamgeUrl=originalIamgeUrl.replace("/upload","/upload/w_250");
    req.flash("success","Listing Edited!");
    res.render("listings/edit.ejs", { listing, originalIamgeUrl });
  };
  
module.exports.updateListing =async(req,res)=>{
    let { id } = req.params;
    let listing =await Listing.findByIdAndUpdate(id,{ ...req.body.listing});

    if(typeof req.file !=="undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image ={url,filename};
    await listing.save();
  }

    req.flash("success"," Listing Updated!");
    res.redirect(`/listings/${id}`);
  };   //req.body.listing ek js object h jiske andr sare parameters h ab deconstruct krke un sare
  // parameters ko individual value k andr convert kra k jisko hum apni new updated value k andr pass krdenge

module.exports.destroyListing =async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
  };