const express = require("express");
const router = express.Router();
const {getEmployer,getEmployerById,employersignUp,verify,employerUpdate,employerDelete,resendOtp} = 
                                                require("../controller/employerController");
const {recover,changepassword,resend} = require("../controller/passwordchangeController");
                                                

const multer = require("multer");
const path = require("path");

// validations
const {signUpVal} = require("../validations/signupvalidations");
const {uploadVal} = require("../validations/uploadvalidations");

const File_Type_Map = {
    "image/jpg" : "jpg",
    "image/jpeg" : "jpeg",
    "image/png" : "png"
}

const storage = multer.diskStorage({
    destination : function (req,file,cb){
        cb(null,"public/employer");
    },
    filename : function (req,file,cb){
        const filename  = file.originalname.split(' ').join('-');
        const extension = File_Type_Map[file.mimetype];
        cb(null,`${filename}-${Date.now()}.${extension}`);
    }
})

const filefilter = (req,file,cb) => {
    const type = file.mimetype;
    if(file.fieldname === "employer"){
        if(type === "image/jpg" || type === "image/jpeg" || type === "image/png"){
            cb(null,true);
        }else{
            cb(null,false);
            return cb(new Error("Invalid Formate."));
        }
    }
}

const maxSize = 1*1024*1024;
const uploadOptions = multer({storage : storage,fileFilter:filefilter,limits : {fileSize : maxSize}}).fields([
    {name : "profile",maxCount : 1},
    {name : "logo",maxCount : 1},
]);

router.get("/",getEmployer);
router.get("/:id", getEmployerById);
router.post("/signup",signUpVal,employersignUp); 
router.put("/update/:id",uploadOptions,uploadVal,employerUpdate);
router.delete("/:id",employerDelete);
router.post("/verify/otp",verify);
router.post("/verify/resend",resendOtp);
router.post("/recover",recover);
router.post("/changepassword",changepassword);
router.post("/changepassword/resend",resend);

module.exports = router;