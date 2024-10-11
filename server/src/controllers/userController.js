const createError = require('http-errors');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const fs = require('fs').promises;
const User = require('../models/userModel');
const { successResponse } = require('./responseController');
const { options } = require('../routers/userRouter');
const {findWithId } = require('../services/findItem');
const { deleteImage } = require('../helper/deleteImage');
const { createJSONWebToken } = require('../helper/jsonwebtoken');
const { JWTActivationKey, clientURL, JWTResetPasswordKey } = require('../secrect');
const emailWithNodeMailer = require('../helper/email');
const { runValidation } = require('../validators');
const { handleUserAction, findUsers, findUserById, deleteUserById, updateUserById, forgetPasswordByEmail, updateUserPasswordById, resetPassword } = require('../services/userService');
// const users = require('../models/userModel');
//const  mongoose  = require('mongoose');

//Data control kore models tai ei kahne likhar dorkar nai
// const users= [
    
//     {id:1, name:'Joy Sarker'},
//     {id:2, name:'Shubam'},
//     {id:3, name:'Hemel'}
// ]

// const getUsers = async (req,res,next)=>{
//     // console.log(req.body.id); //isLoggedIn theke id r upor base kore Database theke data khuje nibe
//     //  res.status(200).send({
//     //     message: "user were returned",
//     //     users:users,
//     try{
//         const search = req.query.search || ""; // Search option er jonno
//         const page = Number(req.query.page) || 1; // By Default Page Number 1
//         // const limit = Number(req.query.limit) || 1; // Koto jon User ke Aksathe dekhate chai seta
//         const limit = Number(req.query.limit) || 5;
       
//         const searchRegExp = new RegExp('.*' + search + ".*","i"); // Jodi name thake Humayun Kabir Sipon, ekhon jodi kew Kabir likhe o search kore tao Search technique kaj korbe. karon Regular Exp. e ami bole diyachi samne pechone ki thakbe seta amar dekhar bisoy noy

//          //Admin jara ache tader dekte chachi na. Sudu User ke dekthe chachi tai niche technique
//          const filter = {
//             isAdmin : { $ne:true},
//             //Name , email , phone ei 3 ta value er jonno search technique apply korar jonno
//             $or:[
//                 {name: {$regex:searchRegExp}},
//                 {email: {$regex:searchRegExp}},
//                 {phone: {$regex:searchRegExp}},
//             ],
//          };
//          //Searching result view korar somoy password gulo dekhate na chaile nicher query set kora lagbe
//          const options = {password: 0};

//         const users = await User.find(filter,options) // Database theke sob gulo user ke khuje debe but password visible hobe na
//         //pagination er jonno mane 1 ta page e koto jon user ke dekhate chai
//         .limit(limit)
//         // proti page e kotogulo user thakbe setar jonno
//         .skip((page - 1) * limit);

//         //document koto gulo ache seta dekhate chaile
//         const count = await User.find(filter).countDocuments();

//         //jodi kono user na thake tahole
//         if(!users) throw createError(404 , " No user Found");    
//             //Nicher Data gulo resposeController.js er Success Handaler method theke asbe tai likher dorkar nai
//            // res.status(200).send({
//                 //     message: "user were returned",
//             // users,
//             // // users: users,

//             // //pagination er object creation
//             // pagination: {
//             //     totalPages: Math.ceil(count / limit),  //count ke limit diya divide kore joto gulo page pawa jabe seigula display korbe
//             //     currentPage: page, //currentPage Hocche property
//             //     previousPage: page-1 > 0 ? page-1 : null,
//             //     nextPage: page+1 <= Math.ceil(count / limit) ? page + 1 : null,
//             // }
//        // });
        
//         return successResponse(res, {
//             statusCode: 200,
//             message: 'users were returned successfully',
//             payload:{
//                 users,
//                 //pagination er object creation
//                 pagination: {
//                     totalPages: Math.ceil(count / limit),  //count ke limit diya divide kore joto gulo page pawa jabe seigula display korbe
//                     currentPage: page, //currentPage Hocche property
//                     previousPage: page-1 > 0 ? page-1 : null,
//                     nextPage: page+1 <= Math.ceil(count / limit) ? page + 1 : null,
//                 },

//             },
//         });

//     } catch(error){
//         next(error)

//     }
//     };





    const handleGetUsers = async (req,res,next)=>{
      
        try{
            const search = req.query.search || ""; 
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 5;
           
            const {users,pagination} = await findUsers(search,limit,page);

            return successResponse(res, {
                statusCode: 200,
                message: 'users were returned successfully',
                payload:{
                    users:users,
                    pagination: pagination,
    
                },
            });
    
        } catch(error){
            next(error);
    
        }
        };



const handleGetUserById = async (req,res,next)=>{
        
        try{
           // console.log(req.user);
            const id = req.params.id;
            const options = {password:0};
            const user = await findUserById(id,options);
            // const options = {password: 0} //kono user er jonno Password show na korte chaile

            // const user = await User.findById(id,options);

            // //jodi kono user na pay
            // if(!user) { throw createError(404,'user does not exist with this id')}
    
            return successResponse(res, {
                statusCode: 200,
                message: 'user were returned successfully',
                payload:{user},
            });
    
        } catch(error){
            // if (error instanceof mongoose.Error){
            //     next(createError(400,'Invalid User Id'))
            //     return;
            // }
            next(error);
    
        }
    };

        const handleDeleteUserById = async (req,res,next)=>{
        
            try{
                const id = req.params.id;
                const options = {password:0};
                 await deleteUserById(id,options); //check kortechi user ache kina

            //     const userImagePath = user.image;

            //    deleteImage(userImagePath)

                //  await User.findByIdAndDelete({
                //     _id:id,
                //     isAdmin:false}); //Admin ke delete korchi na tai eta likha

                //     if(user && user.image) {
                //         await deleteImage(user.image);
                //     }

                return successResponse(res, {
                    statusCode: 200,
                    message: 'user was deleted successfully',
                    
                });
        
            } catch(error){
                next(error);
        
            }
        };

        const handleProcessRegister = async (req,res,next)=>{
        
            try{
                const {name,email,password,phone,address}= req.body;

                const image=req.file;
                if(!image){
                    throw createError(400,'Image file is required');
                }

                if(image>1024*1024*2){
                    throw createError(400,'File is too large . It Must be less than 2 MB');
                }

                //String Image er poriborte Buffer image use korte chaile
                const imageBufferString =image.buffer.toString('base64');

                const userExists= await User.exists({email: email});
                if(userExists){
                    throw createError(409,'User of this email already exists. Please sign in')
                };

                //Create Json Web Token
                const token = createJSONWebToken(
                    {name,email,password,phone,address, image:imageBufferString},
                    JWTActivationKey,
                    '10m'
                );
                
                //prepare email
                const emailData={
                    email,
                    subject:"Account Activation Email",
                    html: `
                    <h2> Hellow ${name} ! </h2>
                    <p> Please click here to <a href="${clientURL}/api/users/activate/${token}" target="_blank"> activate your account </a> </p>
                    `
                }


                //send email with nodemailer
               try {
              await emailWithNodeMailer(emailData)
                
               } catch (emailError) {
                next(createError(500,'Failed to send verification email'));
                return;
               }
               
                return successResponse(res, {
                    statusCode: 200,
                    message: `Please go to your ${email} for Registration process`,
                    payload: {token},
                    
                });
        
            } catch(error){
                next(error);
        
            }
        };




        const handleActivateUserAccount = async (req,res,next)=>{
        
            try{
                const token = req.body.token;
                if(!token) throw createError(404, 'token not found');



                try{
                    const decoded= jwt.verify(token,JWTActivationKey)
               if(!decoded) throw createError(401, 'user was not verified');

               const userExists = await User.exists({email:
                decoded.email});
                if(userExists){
                    throw createError(
                        409,
                        'User with this email already exits. Please sign in'
                    );
                }
               
                //Database e user add korte chaile
                await User.create(decoded)

                return successResponse(res, {
                    statusCode: 201,
                    message:"user was register successfully",
                   
                    
                });


                }catch(error){
                    if(error.name=='TokenExpiredError') {
                        throw createError (401,'Token has expired');

                    }else if(error.name=='JsonWebTokenError') {
                        throw createError(401,'Invalid Token');
                    } else {
                        throw error;
                    }
                }
               
              
        
            } catch(error){
                next(error);
        
            }
        };

        const handleUpdateUserById = async (req,res,next)=>{
        
            try{
                const userId = req.params.id;
                
               // const options = {password:0};

                const updatedUser = await updateUserById(userId,req)


            //    const user= await findWithId(User,userId,options);
            //     const updateOptions = {new: true,runValidators:true,context:'query'};
            //     let updates = {};

            //     //    ***Ei code gulo for loop er maddome kora hoyeche niche
            //     //name, email, password, phone, image,address
            //     // if(req.body.name){
            //     //     updates.name = req.body.name;
            //     // }
                                               
            //     // if(req.body.password){
            //     //     updates.password = req.body.password;
            //     // }

            //     // if(req.body.phone){
            //     //     updates.phone = req.body.phone;
            //     // }

            //     // if(req.body.address){
            //     //     updates.address = req.body.address;
            //     // }

            //     // for(let key in req.body) {
            //     //     if(['name','password','phone','address'].includes(key)){
            //     //         updates[key]=req.body[key];
            //     //     }
            //     //     else if(['email'].includes(key)){
            //     //         throw new Error('Email can not be updated')
            //     //     }
            //     // }

            //     const allowedFields = ['name','password','phone','address'];
            //     for(const key in req.body) {
            //         if(allowedFields.includes(key)){
            //             updates[key] = req.body[key];

            //         } else if (key == 'email') {
            //             throw createError (404,'Email can not be updated');
            //         }
            //     }

            //     const image = req.file?.path;
                
            //     if(image){
            //         //Image maximum size is 2 mb
            //         if(image>1024*1024*2){
            //             // throw createError(400,'File is too large . It Must be less than 2 MB');
            //             throw new Error('File is too large . It Must be less than 2 MB');
            //         }

            //         // jodi 2 MB r basi na hoy then
            //         // updates.image = image.buffer.toString('base64');

            //         updates.image = image;
            //         user.image != 'default.png' && deleteImage (user.image);
            //     }

            //     //delete updates.email;

            //     const updatedUser= await User.findByIdAndUpdate(userId,updates,updateOptions).select("-password") //All user er moddo password dekte na chaile "-passowrd" likhte hoy

            //     if(!updatedUser){
            //         throw createError(404,'User with is ID does not exits');
            //     }


                return successResponse(res, {
                    statusCode: 200,
                    message: 'user was updated successfully',
                    payload:updatedUser,
                    
                });
        
            } catch(error){
                next(error);
        
            }
        };

        //user er dara kew ke bann korte chaile nicher code

        // const handleBanUserById = async (req,res,next)=>{
        
        //     try{
        //         const userId = req.params.id;
        //         await findWithId(User,userId);
        //         const updates= {isBanned:true}
        //         const updateOptions = {new: true,runValidators:true,context:'query'};

           

        //         const updatedUser= await User.findByIdAndUpdate(userId,updates,updateOptions).select("-password") //All user er moddo password dekte na chaile "-passowrd" likhte hoy

        //         if(!updatedUser){
        //             throw createError(400,'User with is ID does not exits');
        //         }


        //         return successResponse(res, {
        //             statusCode: 200,
        //             message: 'user was banned successfully',
                   
                    
        //         });
        
        //     } catch(error){
        //         next(error);
        
        //     }
        // };

         //user ke unbanned korte chaile

        //  const handleUnbanUserById = async (req,res,next)=>{
        
        //     try{
        //         const userId = req.params.id;
        //         await findWithId(User,userId);
        //         const updates= {isBanned:false}
        //         const updateOptions = {new: true,runValidators:true,context:'query'};

           

        //         const updatedUser= await User.findByIdAndUpdate(userId,updates,updateOptions).select("-password") //All user er moddo password dekte na chaile "-passowrd" likhte hoy

        //         if(!updatedUser){
        //             throw createError(400,'User was not unbanned successfully');
        //         }


        //         return successResponse(res, {
        //             statusCode: 200,
        //             message: 'user was Unbanned successfully',
                   
                    
        //         });
        
        //     } catch(error){
        //         next(error);
        
        //     }
        // };

        const handleUpdatePassword = async (req,res,next)=>{
        
            try{
                // email,oldPassword, newPassword, confirmedPassword
                const {email,oldPassword,newPassword,confirmedPassword} = req.body;
                const userId = req.params.id;
                const updatedUser = await updateUserPasswordById(userId,email,oldPassword,newPassword,confirmedPassword);
                


                //const user =await findWithId(user,userId);


                // //Password Matching 
                // const isPasswordMatch = await bcrypt.compare(oldPassword,user.password);
                // if(!isPasswordMatch){
                //     throw createError(400,"OldPassword is not correct");
                // }

                // const filter = {userId};
                // const updates = {$set:{password: newPassword}};
                // const updateOptions = {new : true};



                // // const userId = req.params.id;
                // // await findWithId(User,userId);
                // // const updates= {isBanned:false}
                // // const updateOptions = {new: true,runValidators:true,context:'query'};

           

                // const updatedUser= await User.findByIdAndUpdate(userId,updates,updateOptions).select("-password") //All user er moddo password dekte na chaile "-passowrd" likhte hoy

                // if(!updatedUser){
                //     throw createError(400,'User was not Updated successfully');
                // }


                return successResponse(res, {
                    statusCode: 200,
                    message: 'user was updated successfully',
                    payload:{updatedUser},
                   
                    
                });
        
            } catch(error){
                next(error);
        
            }
        };

        const handleForgetPassword = async (req,res,next)=>{
        
            try{
               
                const {email} = req.body;
                const token = await forgetPasswordByEmail(email);


            //     const userData = await User.findOne({email: email});
            //     if(!userData) {
            //         throw createError(404,'Email is incorrect or you have not verified your email address. Please register yourself first');
            //     }

            //      //Create Json Web Token
            //      const token = createJSONWebToken(
            //         {email},
            //         JWTResetPasswordKey,
            //         '10m'
            //     );
                
            //     //prepare email or Email Sending er jonno
            //     const emailData={
            //         email,
            //         subject:"Reset Password Email",
            //         html: `
            //         <h2> Hellow ${userData.name} ! </h2>
            //         <p> Please click here to <a href="${clientURL}/api/users/reset-password/${token}" target="_blank"> Reset your Password </a> </p>
            //         `
            //     }


            //     //send email with nodemailer
            //    try {
            //   await emailWithNodeMailer(emailData)
                
            //    } catch (emailError) {
            //     next(createError(500,'Failed to send Reset Password email'));
            //     return;
            //    }

               //Uporer try catch block ta nicher vabeo likha jai
               // sendEmail(emailData);
               
                return successResponse(res, {
                    statusCode: 200,
                    message: `Please go to your ${email} for reseting the password`,
                    payload: token,
                    
                });
 
            } catch(error){
                next(error);
        
            }
        };

        const handleResetPassword = async (req,res,next)=>{
        
            try{

                const {token,password} = req.body;
               
                // const decoded = jwt.verify(token,JWTResetPasswordKey);

                // if(!decoded){
                //     throw createError(400,"Invalid or expired token");
                // }

                // const filter = { email: decoded.email};
                // const update = {password:password};
                // const options = {new : true};
                // const updatedUser = await User.findOneAndUpdate(
                //     filter,update,options
                // ).select('-password');

                // if(!updatedUser){
                //     throw createError(400,'Password reset failed');
                // }

                await resetPassword(token,password);

                

                return successResponse(res, {
                    statusCode: 200,
                    message: 'Password Reset successfully',
                   
                   
                    
                });
        
            } catch(error){
                next(error);
        
            }
        };

        //bann and un bann ek sathe likthe chaile
        const handleManageUserStatusById = async (req,res,next)=>{
        
            try{
                const userId = req.params.id;
               const action = req.body.action;
              
            //    let update;
            //    let successMessage;
            //    if(action == 'ban'){
            //     update= {isBanned:true};
            //     successMessage = "User was banned successfully"
            //    } else if(action=='unban'){
            //     update ={isBanned:false};
            //     successMessage= "User was unbanned successfully"
            //    } else{
            //     throw createError(400,'Invalid action, Use "bann" or "unbanned" ');
            //    }

            //    // const updates= {isBanned:true}
            //     const updateOptions = {new: true,runValidators:true,context:'query'};

           

            //     const updatedUser= await User.findByIdAndUpdate(userId,update,updateOptions).select("-password") //All user er moddo password dekte na chaile "-passowrd" likhte hoy

            //     if(!updatedUser){
            //         throw createError(400,'User was not banned successfully');
            //     }

           const successMessage= await handleUserAction(action,userId);

                return successResponse(res, {
                    statusCode: 200,
                    message: successMessage,
                   
                    
                });
        
            } catch(error){
                next(error);
        
            }
        };

       
 

 module.exports = {handleGetUsers,handleGetUserById,handleDeleteUserById,handleProcessRegister,handleActivateUserAccount,handleUpdateUserById,handleManageUserStatusById,handleUpdatePassword,handleForgetPassword,handleResetPassword}; //getUsers,getUserById,handleBanUserById,handleUnbanUserById, handleManageUserStatusById bann and unbann eksathe korte chai tai eta likh lam na