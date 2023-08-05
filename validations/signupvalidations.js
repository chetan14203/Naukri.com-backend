const {check} = require("express-validator");

exports.signUpVal = [
    check("fullName","Please enter FullName"),
    check("email").isEmail(),
    check('password',"Password should contain 8 characters,1 uppercase, 1 lowercase and 1 number.").isStrongPassword({
        minLength : 8,
        minNumbers : 1,
        minLowercase : 1,
        minUppercase : 1,
    }),
    check("mobileNumber","Please Enter 10 digit Mobile number").isLength({
        min : 10,
        max : 10
    })
]
