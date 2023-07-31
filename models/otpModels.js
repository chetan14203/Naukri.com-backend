const mongoose = require("mongoose");

const otpSchema = mongoose.Schema({
    email : {
        type : String,
        required : true,
    },
    otp : {
        type : String,
        required : true
    },
    createdAt : Date,
    expiredAt : Date
})
 
exports.OTP = mongoose.model('OTP',otpSchema);