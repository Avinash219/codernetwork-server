const mongoose = require("mongoose");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    username : String,
    salt : String,
    hash : String,
    email : String,
    status : {
        type : String,
        enum : ["Pending","Active"],
        default : "Pending"
    },
    confirmationCode : {
        type : String,
        unique : true
    }
})

userSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString("hex");

    this.hash = crypto.pbkdf2Sync(password,this.salt,1000, 64, `sha512`).toString(`hex`);
}

userSchema.methods.validatePassword = function(password){
   const hash = crypto.pbkdf2Sync(password,this.salt,1000, 64, `sha512`).toString(`hex`);
   return this.hash === hash;
}
module.exports = mongoose.model("User",userSchema);