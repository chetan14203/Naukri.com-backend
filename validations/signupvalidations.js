const {check} = require("express-validator");

exports.signUpVal = [
    check("fullName","Please enter FullName"),
    check("email").isEmail(),
    check('password',"Password should contain 8 characters.").isStrongPassword({
        minLength : 8
    }),
    check("mobileNumber","Please Enter 10 digit Mobile number").isLength({
        min : 10,
        max : 10
    })
]
