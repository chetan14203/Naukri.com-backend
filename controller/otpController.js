const {OTP} = require("../models/otpModels");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    host : "smtp.gmail.com",
    port : 465,
    secure : true,
    auth : {
        user : "choudharyc355@gmail.com",
        pass : "aeeaypyedgpapxhh", 
    },tls: {
        rejectUnauthorized: false, // Temporary setting for troubleshooting
    },
})

transporter.verify((error,success) => {
    if(error){
        console.log("Failed");
        console.log(error.message);
    }else{
        console.log(success);
        console.log("Ready to send message.")
    }
})

const sendotp = async (email, res) => {
    try{
        const otp = `${Math.floor(1000+Math.random()*9000)}`;
        const mailOptions = {
            from : "d7209367@gmail.com",
            to : email,
            sucject : "Verify your Account.",
            html : `<p>Enter otp <b>${otp}</b> to verify your account.</p>`
        }
        const hashedotp = await bcrypt.hash(otp,10);
        let newOTP = OTP({
            email : email,
            otp : hashedotp,
            createdAt : Date.now(),
            expiredAt : Date.now()+3600000,
        })
        newOTP = await newOTP.save();

        const info = await transporter.sendMail(mailOptions);
        if(!info){
            res.status(404).send("OTP is not sent.")
        }
        res.status(200).json({
           message : "Verify your Account."
        })
    }catch(error){
        res.status(404).json({
            success : "Failed",
            message : error.message
        })
    }
}

module.exports = sendotp; 