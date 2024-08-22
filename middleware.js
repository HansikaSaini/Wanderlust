const Listing = require("./models/listing.js");
const Review  = require("./models/review.js");
const ExpressError= require("./utils/ExpressError.js");
const {listingSchema , reviewSchema}= require("./schema.js");
const review = require("./models/review.js");


module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){ //isauthenticated() islye use hota h taki pta lg ske ki user logged h ya nhi
      req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in to create listing!");
        return res.redirect("/login");
      }
      next();
};

module.exports.saveRedirectUrl = (req,res,next)=>{
  if(  req.session.redirectUrl){
    res.locals.redirectUrl =  req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner =async(req,res,next)=>{
  let {id}=req.params;
  let listing = await Listing.findById(id);
  if(!listing.owner._id.equals(res.locals.currUser._id)){
    req.flash("error","You are not the owner of this listing!");
   return res.redirect(`/listings/${id}`);
  }
  next();
};
module.exports.isreviewAuthor =async(req,res,next)=>{
  let {id,reviewId}=req.params;
  let review = await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error","You did not create this review!");
   return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.validateListing =(req,res,next)=>{
  let {error}=listingSchema.validate(req.body); //humne joi m jo schema bnaya tha, kya request us schema ko validate kr rha h ya nhi 
  if(error){
    let errMsg = error.details.map((el)=> el.message).join(",");
   throw new ExpressError(404,errMsg);
  }else{
    next();
  }
};

module.exports.validateReview =(req,res,next)=>{
  let {error}=reviewSchema.validate(req.body); //humne joi m jo schema bnaya tha, kya request us schema ko validate kr rha h ya nhi 
  if(error){
    let errMsg = error.details.map((el)=> el.message).join(",");
   throw new ExpressError(404,errMsg);
  }else{
    next();
  }
};

