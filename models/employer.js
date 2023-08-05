const mongoose = require("mongoose");
require("dotenv").config();

const employerSchema = mongoose.Schema({
    companyName : {
        type : String,
        required : true,
    },
    employerName : {
        type : String,
        required : true,
    },
    profile : {
        type : String,
    },
    email : {
        type : String,
        required : true,
    },
    mobileNumber : {
        type : String,
        required : true,
    },
    password : {
        type : String,
        required : true,
    },
    position : {
        type : String,
        required : true,
    },
    logo : {
        type : String,
    },
    companyEstablished : {
        type : Date,
    },
    isAdmin : {
        type : Boolean,
        default : true,
    },
    tokens : [{
        token : {
            type : String,
            required : true,
        }
    }]
})

employerSchema.methods.generateAuthToken = async function(){
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

employerSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10);
    }
    next();
})

employerSchema.virtual("id").get(function (){
    return this._id.toHexString();
})

employerSchema.set("JSON",{
    virtuals : true,
})

exports.Employer = mongoose.model("Employer",employerSchema);