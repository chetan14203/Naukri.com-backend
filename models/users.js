const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const userSchema = mongoose.Schema({
    profile : {
        type : String,
        default : '',
    },
    fullName : {
        type : String,
    },
    email : {
        type : String,
        unique : true,
        required : true,
    },
    password : {
        type : String,
        required : true,
    },
    mobileNumber : {
        type : String,
        unique : true,
        required : true,
    },
    position : {
        type : String,
    },
    experience : {
        type : String,
        default : "Fresher",
    },
    companyName : {
        type : String,
        default : '',
    },
    resume : {
        type : String,
        default : '',
    },
    worklocation : {
        type : String,
    },
    verified : {
        type : Boolean,
        default : false
    },
    isAdmin : {
        type : Boolean,
        default : false,
    },
    tokens : [{
        token : {
            type : String,
            required : true,
        }
    }]
},{
    versionKey : false,
})

// generating token
userSchema.methods.generateAuthToken = async function(){
    try{
        const token = jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token});
        await this.save();
        return token;
    }catch(error){
        console.log(error.message);
        return res.send(error.message);
    }
}

userSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10);
    }
    next();
})

userSchema.virtual('id').get(function (){
    return this._id.toHexString();
})

userSchema.set("JSON", {
    virtuals : true,
})

exports.User = mongoose.model("User",userSchema);