const mongoose = require("mongoose");

const uri = "mongodb+srv://choudharyc355:2HOOmumRVLqCMwCP@backend.dz2blr7.mongodb.net/Backend?retryWrites=true&w=majority";
const connectDB = () => {
        console.log("connect DB..");
        return mongoose.connect(uri,{
            useNewUrlParser : true,
            useUnifiedTopology : true,
        });
}

module.exports = connectDB;