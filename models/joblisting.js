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
    },
    posts : {
        type : Object,
        default : []
    },
    comments : {
        type : Object,
        default : []
    },
    actions : {
        type : Object,
        default : [],
    },
    feed : {
        type : Object,
        default : []
    }
})

exports.Job = mongoose.model("Job",jobSchema);