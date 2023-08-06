const {Payment} = require("../models/paymentModels");
const {User} = require("../models/users");
const {Job} = require("../models/joblisting")

const maxFreePosting = 5;

const checklimit = async (req,res,next) => {
    try{
        const user = req.user.id;
        const userpayment = await Payment.findOne({_id : user}).success;
        const employer = await User.findOne({_id : user}).isAdmin;
        if(!userpayment || !employer){
            return res.json("You are not authorized to post job.");
        }
        const jobpostcount = await Job.countDocuments({_id : user});
        if(userpayment || employer || jobpostcount < 5 ){
            next();
        }else{
            return res.status(403).json("You have reached the maximum number of allowed Job post.")
        }
    }catch(err){
        console.log(err.message);
        return res.status(500).json("Something went wrong.");
    }
}

module.exports = checklimit;