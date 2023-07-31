const express = require("express");
const router = express.Router();
const {getUser,getUserById,signUp,userUpdate,userDelete,verify} = require("../controller/userController");
const {recover,changepassword} = require("../controller/passwordchangeController");

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

const maxSize = 1*1024*1024;
const uploadOptions = multer({storage : storage,fileFilter : filefilter,limits : {fileSize : maxSize}}).fields([
    {name : "profile" , maxCount : 1}, {name : "resume",maxCount : 1}
]);

router.get("/",getUser);
router.get("/:id", getUserById);
router.post("/signUp",signUpVal,signUp); 
router.put("/update/:id",uploadOptions,uploadVal,userUpdate);
router.delete("/:id",userDelete);
router.post("/verify/otp",verify);
router.post("/recover",recover);
router.post("/changepassword",changepassword);

module.exports = router;