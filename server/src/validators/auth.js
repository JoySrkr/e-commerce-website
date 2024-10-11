const {body}= require("express-validator");
//Registration Validation
const validateUserRegistration = [
    //chaining er maddome validation korte chaile
    body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is Require. Enter your full name") //Name empty hole message dete chai
    .isLength({min:3, max:32})
    .withMessage("Name Should be at least 3 to 31 character"),

    body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is Require. Enter your email address") //Name empty hole message dete chai
    .isEmail()
    .withMessage("Invalid email address"),

    body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is Require.Enter your password") //Name empty hole message dete chai
    .isLength({min:6})
    .withMessage("Password Should be at least 6 character")
    .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .withMessage('Password Should contain at least one Uppercase letter, one lowercase letter, one number,and one special character.'),


    body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is Require.Enter your Address") //Name empty hole message dete chai
    .isLength({min:3})
    .withMessage("Address Should be at least 3 character"),

    body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone is Require. Enter your phone number"), //Name empty hole message dete chai

    // body("image")
    // .optional()
    // .isString()
    // .withMessage("User Image is Require"),

    //Buffer Image er jonno
    body("image")
    .custom((value,{req}) =>{
        if(!req.file || !req.file.buffer){
            throw new Error ('User image is required');
        }
        return true;
    })
    .withMessage("User Image is Require"),
    
    
]

const validateUserlogin = [
   
    body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is Require. Enter your email address") //Name empty hole message dete chai
    .isEmail()
    .withMessage("Invalid email address"),

    body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is Require.Enter your password") //Name empty hole message dete chai
    .isLength({min:6})
    .withMessage("Password Should be at least 6 character")
    .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .withMessage('Password Should contain at least one Uppercase letter, one lowercase letter, one number,and one special character.'),
   
];

const validateUserPasswordUpdate = [
   
    // body("email")
    // .trim()
    // .notEmpty()
    // .withMessage("Email is Require. Enter your email address") //Name empty hole message dete chai
    // .isEmail()
    // .withMessage("Invalid email address"),

    body("oldPassword")
    .trim()
    .notEmpty()
    .withMessage("Old Password is Require.Enter your old password") //Name empty hole message dete chai
    .isLength({min:6})
    .withMessage("Old Password Should be at least 6 character")
    .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .withMessage('Password Should contain at least one Uppercase letter, one lowercase letter, one number,and one special character.'),
   
    body("newPassword")
    .trim()
    .notEmpty()
    .withMessage("New Password is Require.Enter your new password") //Name empty hole message dete chai
    .isLength({min:6})
    .withMessage("New Password Should be at least 6 character")
    .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .withMessage('Password Should contain at least one Uppercase letter, one lowercase letter, one number,and one special character.'),

    body('confirmedPassword').custom((value,{req})=>{
        if (value !== req.body.newPassword){
            throw new Error ("Password did not match")
        }
        return true;

    })
   
];

const validateUserForgetPassword = [
   
    body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is Require. Enter your email address") //Name empty hole message dete chai
    .isEmail()
    .withMessage("Invalid email address"),

];

const validateUserResetPassword = [
   
    body("token")
    .trim()
    .notEmpty()
    .withMessage("Token is Missing"), //Name empty hole message dete chai

    body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is Require.Enter your password") //Name empty hole message dete chai
    .isLength({min:6})
    .withMessage("Password Should be at least 6 character")
    .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .withMessage('Password Should contain at least one Uppercase letter, one lowercase letter, one number,and one special character.'),
   
    

];

// const validateRefreshToken = [
   
//     body("token")
//     .trim()
//     .notEmpty()
//     .withMessage("Token is Missing"), //Name empty hole message dete chai



// ];

module.exports={validateUserRegistration,validateUserlogin,validateUserPasswordUpdate,validateUserForgetPassword,validateUserResetPassword}