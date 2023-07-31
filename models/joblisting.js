const mongoose = require("mongoose");

const joblistschema = mongoose.Schema({
    employer : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Employer'
    },
    companyName : {
        type : String,
        required : true
    },
    postName : {
        type : String,
        required : true
    },
    location : {
        type : String,
        required : true
    },
    jobDescription : {
        type : String,
        default : ''
    },
    otherDetails : {
        type : String,
        required : true
    },
});

exports.JOBLIST = mongoose.model('JOBLIST',joblistschema);