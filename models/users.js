const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    profile : {
        type : String,
        default : '',
    },
    fullName : {
        type : String,
    },
    email : {
        type : String,
        unique : true,
        required : true,
    },
    password : {
        type : String,
        required : true,
    },
    mobileNumber : {
        type : String,
        unique : true,
        required : true,
    },
    position : {
        type : String,
    },
    workStatus : {
        type : String,
        default : "Fresher",
    },
    resume : {
        type : String,
        default : '',
    },
    worklocation : {
        type : String,
    },
    verified : {
        type : Boolean,
        default : false
    },
    isAdmin : {
        type : Boolean,
        default : false,
    }
})

userSchema.virtual('id').get(function (){
    return this._id.toHexString();
})

userSchema.set("JSON", {
    virtuals : true,
})

exports.User = mongoose.model("User",userSchema);