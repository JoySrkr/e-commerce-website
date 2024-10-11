//app.get ei function ta hendel korar jonno express function ke call kora lage
const express = require("express");
const { handleManageUserStatusById, handleDeleteUserById, handleGetUsers, handleGetUserById, handleUpdateUserById, handleActivateUserAccount, handleProcessRegister, handleUnbanUserById, handleBanUserById, handleUpdatePassword, handleForgetPassword, handleResetPassword } = require("../controllers/userController");  //  getUsers, getUserById, deleteUserById, processRegister, activateUserAccount, updateUserById,   bann and unbann ek korte chai tai eta 'handleUnbanUserById, handleBanUserById,' bad dilam
const upload = require("../middlewares/uploadFile");
const { validateUserRegistration, validateUserPasswordUpdate, validateUserForgetPassword, validateUserResetPassword } = require("../validators/auth");
const { runValidation } = require("../validators");
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middlewares/auth");
const userRouter= express.Router();

// Eigula sob controller Part er kaj tai Ei jaygai rakchina userController.js e sob niya jacchi


// const users= [
    
//     {id:1, name:'Joy Sarker'},
//     {id:2, name:'Shubam'},
//     {id:3, name:'Hemel'}
// ]



// //userRouter likha hoyache ei jaygai app.get() eta chilo app.get() eta ke handle korar jonno express function ke call kora lage
// // + /api/users likha chilo '/' ei jaygai eta jehetu common point tai etake app.js er vitor eivabe: app.use('/api/users'.userRouter); likhechi
//  userRouter.get("/", (req,res)=>{
//      // console.log(req.body.id); //isLoggedIn theke id r upor base kore Database theke data khuje nibe
//       res.status(200).send({
//          message: "user were returned",
//          users:users,
//      });
//   });

// (req,res)=> { .... }  eta hocche controller part tai ekhane rakchi na userController.js e niya jacchi
 
// api/users ei router e cll delay controller (userController.js) part e chole jabe
userRouter.post('/process-register',
    upload.single("image"),
    validateUserRegistration,isLoggedOut,
    runValidation ,
    
    handleProcessRegister)  //form e file chose e key name ta 'image' tai image liklam
userRouter.post('/activate', isLoggedOut,handleActivateUserAccount)



// userRouter.get("/",isLoggedIn,isAdmin ,getUsers);
userRouter.get("/",isLoggedIn,isAdmin ,handleGetUsers);
userRouter.get('/:id', isLoggedIn ,handleGetUserById);
// userRouter.delete('/:id',isLoggedIn ,deleteUserById)
userRouter.delete('/:id',isLoggedIn ,handleDeleteUserById)

userRouter.put('/reset-password', validateUserResetPassword,runValidation,handleResetPassword);

userRouter.put('/:id',upload.single('image'),isLoggedIn,handleUpdateUserById)  // userRouter.put('/:id',uploadUserImage.single('image'),isLoggedIn,handleUpdateUserById) video te eta deya ache



// userRouter.put('/ban-user/:id',isLoggedIn,isAdmin,handleBanUserById)

// userRouter.put('/unban-user/:id',isLoggedIn,isAdmin,handleUnbanUserById)

userRouter.post('/forget-password', validateUserForgetPassword,runValidation,handleForgetPassword);





userRouter.put('/update-password/:id', validateUserPasswordUpdate,runValidation,isLoggedIn,handleUpdatePassword);

userRouter.put('/manage-user/:id',isLoggedIn,isAdmin,handleManageUserStatusById)




//  // /profile kaj korche kina seta dekhar jonno niya chilam
// //  userRouter.get("/profile", (req,res)=>{
// //     // console.log(req.body.id); //isLoggedIn theke id r upor base kore Database theke data khuje nibe
// //      res.status(200).send({
// //          message: "user profile is returned",
// //         //  users:users,
// //      });
// //  });

 //userRouter ke app.js e bebohar korar jonno exports kora lagche
 module.exports = userRouter;