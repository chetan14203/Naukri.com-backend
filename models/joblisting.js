const mongoose = require("mongoose");

const jobSchema = mongoose.Schema({
    _id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },
    position : {
        type : String,
        required : true
    },
    location : {
        type : String,
        required : true
    },
    discription : {
        type : String,
        required : true
    }
})

exports.Job = mongoose.model("Job",jobSchema);