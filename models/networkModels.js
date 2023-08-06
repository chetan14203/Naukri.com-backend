const mongoose = require("mongoose");

const networkSchema = mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    connection : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
})

networkSchema.virtual('id').get(function(){
    return this._id.tohexString();
})

networkSchema.set("JSON",{
    virtuals : true,
})

exports.Network = mongoose.model("Network",networkSchema);