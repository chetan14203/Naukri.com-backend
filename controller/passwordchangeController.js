const sendotp = require("../controller/otpController");
const bcrypt = require("bcryptjs");
const {OTP} = require("../models/otpModels")
const {User} = require("../models/users");
const {Employer} = require("../models/employer");

const verifyOtp = async (email, otp, passwordhash) => {
    const user = await OTP.findOne({ email });
    if (!user) {
      return [false, "Invalid Employee or Employer."];
    }
    if (user.expiredAt < user.createdAt) {
      await OTP.findOneAndRemove({ email });
      return [false, "OTP is expired."];
    }
    const isVerify = await bcrypt.compare(otp, user.otp);
    if (!isVerify) {
      return [false, "Invalid OTP."];
    }
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: { password: passwordhash } },
      { new: true }
    );
    return [true, "Password is changed."];
  };
  
  const changepassword = async (req, res) => {
    const {email, otp, password } = req.body;
    const passwordhash = await bcrypt.hash(password, 10);
    const [success, result] = await verifyOtp(req.body.email, otp, passwordhash);
    if (!success) {
      return res.status(404).json(result);
    }
    await OTP.findOneAndRemove({ email });
    return res.json(result);
  };
  
  const recover = async (req, res) => {
    const email = req.body.email;
    const user = await User.findOne({ email }) || await Employer.findOne({email});
    if (!user) {
      return res.status(404).json("Employee or Employer is not registered");
    }
    sendotp(email,res);
  };

const resend = async (req,res) => {
    const email = req.body.email;
    const isEmail = await User.findOne({email});
    if(!isEmail){
      return res.json("Employee or Employer is not registered.")
    }
    recover(req,res);
}

  module.exports = {recover,changepassword,resend};