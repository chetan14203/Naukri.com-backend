const mongoose = require("mongoose");

const connectDB = async ()=>{
    try{
        await mongoose.connect("mongodb://127.0.0.1:27017/naukri",{
            useNewUrlParser : true,
        })
        console.log(`connected with database successfully..`);
    }catch(err){
        console.log(`connection is failed`);
    }
}

module.exports = connectDB;