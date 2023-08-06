const {check} = require("express-validator");

exports.signUpVal = [
    check("fullName",{message :"Please enter FullName"}),
    check("mobileNumber",{message :"Please Enter 10 digit Mobile number"}).isLength({
        min : 10,
        max : 10
    })
]
