const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema({
    _id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    },
    paymentid : {
        type : String,
        required : true
    },
    amount : {
        type : Number,
        rquired : true
    },
    date : {
        type : Date,
        required : true,
    },
    success : {
        type : String,
        default : "Failed"
    }
})

paymentSchema.virtual('id').get(function (){
    return this._id.toHexString();
})

paymentSchema.set("JSON", {
    virtuals : true,
})

exports.Payment = mongoose.model("Payment",paymentSchema);