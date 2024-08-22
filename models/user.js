const { required } = require("joi");
const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required:true,
    },
});

userSchema.plugin(passportLocalMongoose); //we use plugin here bcuz ye automatically username passwrd hashing salting and hashed passwrd generate krdeta h

const User =mongoose.model("User",userSchema);
module.exports =  User;


