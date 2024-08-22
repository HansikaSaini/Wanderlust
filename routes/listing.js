const express = require ("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudconfig.js");
const upload = multer({storage});//multer by default humari files ko cloudinary m store krayega

router.route("/").get(wrapAsync(listingController.index))//index route 
.post(isLoggedIn, upload.single('listing[image]'),
wrapAsync(listingController.createListing));//create route 



//new route    or is route ko humne upr isiye rkha h qki router .js new ko ek id smjh rha h is confusion ko dur krne k liye humne ise upr rkha h
router.get("/new",isLoggedIn,wrapAsync(listingController.renderNewForm));


router.route("/:id").get(wrapAsync(listingController.showListing))//show route 
.put(isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.updateListing))   //update route   
.delete(isLoggedIn,isOwner ,wrapAsync( listingController.destroyListing));//delte route

//edit route 
router.get("/:id/edit",isLoggedIn,isOwner , wrapAsync(listingController.renderEditForm));


module.exports= router;