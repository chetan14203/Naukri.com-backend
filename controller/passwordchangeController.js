const sendotp = require("../controller/otpController");
const bcrypt = require("bcryptjs");

const verifyOtp = async (email, otp, passwordhash) => {
    const user = await OTP.findOne({ email });
    if (!user) {
      return [false, "Invalid user."];
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
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json("User is not registered");
    }
    sendotp(user,res);
  };

  module.exports = {recover,changepassword};