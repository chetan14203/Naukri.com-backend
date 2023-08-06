const {check} = require("express-validator");

exports.signUpVal = [
    check("fullName","Please enter FullName"),
    check("email").isEmail(),
    check("mobileNumber","Please Enter 10 digit Mobile number").isLength({
        min : 10,
        max : 10
    })
]
