const {User} = require("../models/users");
const bcrypt = require("bcryptjs");
const {validationResult} = require("express-validator");
const sendotp = require("../controller/otpController");
const {OTP} = require("../models/otpModels");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const getUser = async (req,res) => {
    const user = await User.find().select('-tokens -password -__v -verified -isAdmin');
    if(!user){
        return res.status(404).json("User is not registered");
    }
    return res.status(200).json(user);
}

const getUserById = async (req,res) => {
    const id = req.body.search;
    const userById = await User.find({
        "$or" : [
            {fullName : {$regex : id, $options: "i"}},
            {worklocation : {$regex : id, $options: "i"}},
            {position : {$regex : id, $options: "i"}},
        ]
    }).select('-tokens -password -__v -verified -isAdmin');
    if(!userById){
        return res.status(404).json("No record is available");
    }
    return res.status(200).json(userById);
}

const signup = async (req,res) => {
    try{
          const errors = validationResult(req);
          if(!errors.isEmpty()){
            return res.status(409).json(errors.array());
          }
          const {fullName,email,password,mobileNumber,position,experience,companyName,workLocation} = req.body;
          const Emailregistered = await User.findOne({email :email});
          if(Emailregistered){
            return res.json({message :"Email is already registered."});
          }
          const numberRegistered = await User.findOne({mobileNumber :mobileNumber});
          if(numberRegistered){
            return res.json({message :"Mobile Number is already registered."});
          }
          let userRegistration = User({
            fullName : fullName,
            email : email,
            password :password,
            mobileNumber : mobileNumber,
            position : position,
            experience : experience,
            companyName : companyName,
            workLocation : workLocation,
          })
          const token = await userRegistration.generateAuthToken();
          res.cookie("jwt", token, {
            expires : new Date(Date.now()+30000),
            httpOnly : true,
          });
          userRegistration = await userRegistration.save();
          if(!userRegistration){
            return res.status(409).json({message :"Account is not valid."});
          }
          sendotp(email,res);
    }catch(err){
        console.log(err.message);
        return res.status(500).json({message : "Something went Wrong,"});
    }      
}

const userUpdate = async (req,res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(409).json(errors.array());
    }
    const basePath  = `${req.protocol}://${req.get('host')}`;
    const photo = req.files.profile[0].filename;
    const docs = req.files.resume[0].filename;
    const user = await User.findByIdAndUpdate(req.params.id,{
        profile : `${basePath}/${photo}`,
        fullName : req.body.fullName,
        email : req.body.email,
        mobileNumber : req.body.mobileNumber,
        position : req.body.position,
        experience : req.body.workStatus,
        resume : `${basePath}/${docs}`,
        workLocation : req.body.workLocation,
    })
    if(!user){
        return res.status(404).json("User is not registered");
    }
    return res.status(200).json("Account is updated.");
}

const userDelete = async (req,res) => {
    const user = await User.findByIdAndRemove(req.params.id);
    if(!user){
        return next("Account is not found");
    }
    return res.status(200).json("Account is deleted.");
}

const validateUserSignUp = async (email, otp) => {
  const user = await OTP.findOne({
    email,
  });
  if (!user) {
    return [false, 'User not found'];
  }
  if(user.expiredAt < user.createdAt){
    await OTP.findOneAndRemove({email});
    return [false,'OTP is expired.']
  }
  const isVerify = await bcrypt.compare(otp,user.otp);
  if (user && !isVerify) {
    return [false, 'Invalid OTP'];
  }
  const updatedUser = await User.findOneAndUpdate({email}, {
    $set: { verified: true },
  },{new : true});
  await OTP.findOneAndRemove({email});
  return [true, "Account is verified."];
};

const verify = async (req, res) => {
    const {email,otp} = req.body;
    const [success, result] = await validateUserSignUp(email, otp);
    if (!success) {
      return res.status(404).json(result);
    }
    return res.send(result);
};

const resendOtp = async (req,res) => {
  const user = req.params.id;
  const email = user.email;
  if(!email){
    return res.json("Employee is not registered.")
  }
  sendotp(email,res);
};

const signin = async (req,res) => {
  const email = req.body.email;
  const password = req.body.password;
  const isVerified = email.verified;
  if(!isVerified){
    return res.json("Verify your account.");
  }
  const useremail = await User.findOne({email});
  const isMatch = await bcrypt.compare(password,useremail.password);
  const token = await useremail.generateAuthToken();
  res.cookie("jwt", token, {
    expires : new Date(Date.now()+60000),
    httpOnly : true,
  });
  if(!useremail){
    return res.json("Employee is not registered");
  }
  if(isMatch){
    return res.redirect("/homepage");
  }
  return res.json("Invalid Credentials");
}

const logout = async (req,res) => {
  try{
    req.user.tokens = req.user.tokens.filter((elem) =>{
      return elem.token !== req.token;
    })
    res.clearCookie("jwt");
    await req.user.save();
    return res.redirect("/login");
  }catch(error){
    return res.status(500).send(error.message);
  }
}

module.exports = {getUser,getUserById,signup,userUpdate,userDelete,verify,resendOtp,signin,logout};