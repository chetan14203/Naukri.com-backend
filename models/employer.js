const mongoose = require("mongoose");

const employerSchema = mongoose.Schema({
    companyName : {
        type : String,
        required : true,
    },
    employerName : {
        type : String,
        required : true,
    },
    profile : {
        type : String,
    },
    email : {
        type : String,
        required : true,
    },
    mobileNumber : {
        type : String,
        required : true,
    },
    password : {
        type : String,
        required : true,
    },
    position : {
        type : String,
        required : true,
    },
    logo : {
        type : String,
    },
    companyEstablished : {
        type : Date,
    },
    isAdmin : {
        type : Boolean,
        default : true,
    }
})

employerSchema.virtual("id").get(function (){
    return this._id.toHexString();
})

employerSchema.set("JSON",{
    virtuals : true,
})

exports.Employer = mongoose.model("Employer",employerSchema);