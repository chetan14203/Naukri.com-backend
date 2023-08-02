const {User} = require("../models/users");
const bcrypt = require("bcryptjs");
const {validationResult} = require("express-validator");
const sendotp = require("../controller/otpController");
const {OTP} = require("../models/otpModels");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const getUser = async (req,res) => {
    const user = await User.find().select("-password");
    if(!user){
        return res.status(404).json("User is not registered");
    }
    return res.status(200).json(user);
}

const getUserById = async (req,res) => {
    const {id} = req.params;
    const userById = await User.find({
        "$or" : [
            {fullName : {$regex : id}},
            {worklocation : {$regex : id}},
            {position : {$regex : id}},
        ]
    }).select("-password");
    if(!userById){
        return res.status(404).json("No record is available");
    }
    return res.status(200).json(userById);
}

const signUp = async (req,res) => {
    try{
          const errors = validationResult(req);
          if(!errors.isEmpty()){
            return res.status(409).json(errors.array());
          }
          const {fullName, email, userpassword, mobileNumber, position, workStatus, workLocation} = req.body;
          const Emailregistered = await User.findOne({email :email});
          if(Emailregistered){
            return res.status(404).json("Email is already registered.");
          }
          const numberRegistered = await User.findOne({mobileNumber :mobileNumber});
          if(numberRegistered){
            return res.status(404).json("Mobile Number is already registered.");
          }
          const passwordHash = bcrypt.hashSync(userpassword,10);
          let userRegistration = User({
            fullName : fullName,
            email : email,
            password :passwordHash,
            mobileNumber : mobileNumber,
            position : position,
            workStatus : workStatus,
            workLocation : workLocation,
          })
          userRegistration = await userRegistration.save();
          if(!userRegistration){
            return res.status(404).json("Account is not valid.");
          }
          sendotp(email,res);
    }catch(err){
        console.log(err);
        return res.status(500).json(err.message);
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
        workStatus : req.body.workStatus,
        resume : `${basePath}/${docs}`,
        workLocation : req.body.workLocation,
    })
    if(!user){
        return res.status(404).json("User is not registered");
    }
    return res.status(200).json(user);
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
  return [true, updatedUser];
};

const verify = async (req, res) => {
    const { email, otp } = req.body;
    const [success, result] = await validateUserSignUp(email, otp);
    if (!success) {
      return res.status(404).json(result);
    }
    await OTP.findOneAndRemove({email});
    return res.send(result);
};

const resendOtp = async (req,res) => {
  const resend = req.body.resend;
  sendotp(req.body.email,res);
  verify(req,res);
};

const signin = async (req,res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const secret = process.env.SECRET_KEY;

    if (!user) {
      return res.status(404).json({ message: "Employee is not registered" });
    }

    const passwordHash = user.passwordHash;

    if (!password || !passwordHash) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = bcrypt.compareSync(password, passwordHash);

    if (isPasswordValid) {
      const token = jwt.sign(
        {
          userId: user.id,
          isAdmin: user.isAdmin,
        },
        secret,
        { expiresIn: "1d" }
      );
      res.status(200).json({ userId: user.id, token:token });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error logging in" });
  }
}

module.exports = {getUser,getUserById,signUp,userUpdate,userDelete,verify,resendOtp,signin};