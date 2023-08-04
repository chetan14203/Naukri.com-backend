const {Employer} = require("../models/employer");
const bcrypt = require("bcryptjs");
const {validationResult} = require("express-validator");
const path = require("path");
const sendotp = require("../controller/otpController");
const jwt = require("jsonwebtoken");

const getEmployer = async (req,res) => {
    const employer = await Employer.find().select("-password");
    if(!employer){
        return res.status(404).json("Employer is not registered.");
    }
    return res.status(200).json(employer);
}

const getEmployerById = async (req,res) => {
    const {id} = req.params;
    const getEmployerById = Employer.findById({
        "$or" : [
            {companyName : {$regex : id}},
            {employerName : {$regex : id}},
        ]
    }).select("-password");
    if(!getEmployerById){
        return res.status(404).json("Employer is Invalid.");
    }
    return res.status(200).json(getEmployerById);
}

const employersignUp = async (req,res) => {
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(409).json(errors.array());
        }
        passwordHash = bcrypt.hashSync(req.body.password,10);
        const basePath = `${req.protocol}://${req.get('host')}`;
        const logoName = req.files.logo[0].filename;
        const profileName = req.files.profile[0].filename;
        let employerRegistration = Employer({
            companyName : req.body.companyName,
            employerName : req.body.employerName,
            profile : `${basePath}/${profileName}`,
            position : req.body.position,
            password : passwordHash,
            logo : `${basePath}/${logoName}`,
            companyEstablished : req.body.comapnyEstablished,
        })
        employerRegistration = await employerRegistration.save();
        if(!employerRegistration){
            return res.status(404).json("Employer is not found.");
        }
        sendotp(employerRegistration,res);
    }catch(err){
        return res.status(404).json(err.message);
    }
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

const employerUpdate = async (req,res) => {
    const employerExist = await Employer.findOne({_id:req.params.id});
    let newPassword;
    if(!req.body.password){
        newPassword = employerExist.password;
    }else{
        newPassword = bcrypt.hashSync(req.body.password,10);
    }
    const basePath = `${req.protocol}://${req.get('host')}`;
    const logoName = req.files.logo[0].filename;
    const profileName = reqq.files.profile[0].filename;
    const employerUpdate = await Employer.findByIdAndUpdate(req.params.id,{
        companyName : req.body.companyName,
        employerName : req.body.employerName,
        profile : `${basePath}/${profileName}`,
        position : req.body.position,
        password : newPassword,
        logo : `${basePath}/${logoName}`,
        companyEstablished : req.body.companyEstablished,
    },{new : true});
    if(!employerUpdate){
        return res.status(404).json("Employer is not found.");
    }
    return res.status(200).json(employerUpdate);
}

const employerDelete = async (req,res) => {
    const employerDeactivation = await Employer.findByIdAndRemove(req.params.id);
    if(!employerDeactivation){
        return res.status(404).json("Employer is not found");
    }
    return res.status(200).json("Account is deleted.");
}

const resendOtp = async (req,res) => {
  const resend = req.body.resend;
  const user = req.params.id;
  const email = user.email;
  if(!email){
    return res.json("Employer is not registered.")
  }
  sendotp(email,res);
};

module.exports = {getEmployer,getEmployerById,employersignUp,verify,employerUpdate,employerDelete,resendOtp};