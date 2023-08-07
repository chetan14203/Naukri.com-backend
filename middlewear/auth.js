const jwt = require("jsonwebtoken");
const User = require("../models/users");
require('dotenv').config();

const auth = async (req,res,next) => {
    try{
        const token = req.cookies.jwt;
        const VerifyUser = jwt.verify(token,process.env.SECRET_KEY);
        const user = await User.findOne({_id:VerifyUser});

        req.token = token;
        req.user = user;
        
        next();
    }catch(error){
        return res.status(401).json({
            "code" : 401,
            "status" : "failure",
            "data" : "Invalid Token!"
        });
    }
}

module.exports = auth;