const express = require("express");
const router = express.Router();
const {getUser,getUserById,signup,userUpdate,userDelete,verify,resendOtp,signin,logout,getProfile} = require("../controller/userController");
const {recover,changepassword,resend} = require("../controller/passwordchangeController");
const auth = require("../middlewear/auth")

const multer = require("multer");
const path = require("path");

// validations
const {signUpVal} = require("../validations/signupvalidations");
const {uploadVal} = require("../validations/uploadvalidations");

const File_Type_Map = {
    "image/jpg" : "jpg",
    "image/jpeg" : "jpeg",
    "image/png" : "png",
    "application/pdf" : "pdf",
    "application/msword" : "msword",
}

const storage = multer.diskStorage({
    destination : function(req,file,cb){
        const type = File_Type_Map[file.mimetype];
        if(type === "jpg" || type === "jpeg" || type === "png"){
            cb(null,"public/profile");
        }else{
            cb(null,"public/resume");
        }
    },
    filename : function(req,file,cb) {
        const filename = file.originalname.split(' ').join("-");
        const extension = File_Type_Map[file.mimetype];
        cb(null,`${filename}-${Date.now()}.${extension}`);
    },
})

const filefilter = (req,file,cb) => {
    const type = File_Type_Map[file.mimetype];
    if(file.fieldname === "profile"){
        if(type === "jpg" || type === "jpeg" || type === "png"){
            cb(null,true);
        }else{
            cb(null,false);
            return cb(new Error("Only jpg,jpeg and png formate is allowed."));
        }
    }
    if(file.fieldname === "resume"){
        if(type === "pdf" || type === "msword"){
            cb(null,true);
        }else{
            cb(null,false);
            return cb(new Error("Only pdf and documents are allowed"));
        }
    }
}

const uploadOptions = multer({storage : storage,fileFilter : filefilter}).fields([
    {name : "profile" , maxCount : 1}, {name : "resume",maxCount : 1}
]);

router.get("/",auth,getUser);
router.get("/:id",auth,getUserById);
router.post("/signup",signUpVal,signup); 
router.put("/update/:id",uploadOptions,uploadVal,auth,userUpdate);
router.delete("/:id",auth,userDelete);
router.post("/verify/otp",verify);
router.post("/verify/resend",resendOtp);
router.post("/recover",recover);
router.post("/changepassword",changepassword);
router.post("/changepassword/resend",resend);
router.post("/login",signin)
router.get("/logout",auth,logout);
router.get("/profile/:id",auth,getProfile);

module.exports = router;