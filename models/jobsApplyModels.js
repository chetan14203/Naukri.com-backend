const mongoose = require("mongoose");

const jobApplySchema = mongoose.Schema({
    user : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }],
    resume : {
        type : String,
        required : true
    }
});

jobApplySchema.virtual('id').get(function (){
    return this._id.toHexString();
})

jobApplySchema.set('JSON',{
    virtuals : true
})

exports.JobApply = mongoose.model('JobApply',jobApplySchema);