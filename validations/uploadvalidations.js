const {check} = require("express-validator");

exports.uploadVal = [
    check("profile","logo").custom((value,{req}) =>{
        const type = req.files.profile[0].mimetype || req.files.logo[0].mimetype ;
        if(type === "image/jpg" || type === "image/jpeg" || type === "image/png"){
            return true;
        }else{
            return false;
        }
    }).withMessage("Please upload in jpeg or jpg or png formate."),
    check("resume").custom((value,{req})=>{
        const type = req.files.resume[0].mimetype;
        if(type === "application/msword" || type === "application/pdf"){
            return true;
        }else{
            return false;
        }
    }).withMessage("Please upload resume in pdf or documents formate.")
]