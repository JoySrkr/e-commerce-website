const createError = require("http-errors");
const User = require("../models/userModel");
// const { model, default: mongoose } = require("mongoose");
const mongoose  = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')
const { deleteImage } = require("../helper/deleteImage");
const createHttpError = require("http-errors");
const { createJSONWebToken } = require("../helper/jsonwebtoken");
const { JWTResetPasswordKey, clientURL } = require("../secrect");
const emailWithNodeMailer = require("../helper/email");

const findUsers = async (search,limit,page) =>{
    try {
        const searchRegExp = new RegExp('.*' + search + '.*','i');
        const filter = {
            isAdmin: { $ne:true},
            $or: [
                {name: {$regex: searchRegExp}},
                {email: {$regex:searchRegExp}},
                {phone: {$regex:searchRegExp}},
            ],
        };
        const options = {password: 0};

        const users = await User.find(filter,options)
        .limit(limit)
        .skip((page-1)*limit);
        const count = await User.find(filter).countDocuments();

        if(!users || users.length ==0) throw createError(404,'no users found');

        return {
            users,
            pagination: {
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                previousPage: page - 1 > 0 ? page - 1 : null,
                nextPage: page + 1 <= Math.ceil(count /limit) ? page + 1 : null,
            },
        };
    } catch (error) {
        throw error;
    }
}

const findUserById = async (id,options={}) => {

    try {
        const user = await User.findById(id,options);
        if(!user) throw createError (404,'User not found');
        return user;
        
    } catch (error) {
        if(error instanceof mongoose.Error.CastError){
            throw createError(400,'Invalid Id');
        }
        throw error;
    }
}

const deleteUserById = async (id,options={}) => {

    try {
      const user=  await User.findByIdAndDelete({
            _id:id,
            isAdmin:false}); //Admin ke delete korchi na tai eta likha

            if(user && user.image) {
                await deleteImage(user.image);
            }
        // return user;
        
    } catch (error) {
        if(error instanceof mongoose.Error.CastError){
            throw createError(400,'Invalid Id');
        }
        throw error;
    }
}


const updateUserById = async (userId,req) => {

    try {
        //const options = { password: 0};
        const user= await findUserById(userId,options);
                const updateOptions = {new: true,runValidators:true,context:'query'};
                let updates = {};

                const allowedFields = ['name','password','phone','address'];
                for(const key in req.body) {
                    if(allowedFields.includes(key)){
                        updates[key] = req.body[key];

                    } else if (key == 'email') {
                        throw createError (404,'Email can not be updated');
                    }
                }

                const image = req.file?.path;
                
                if(image){
                    //Image maximum size is 2 mb
                    if(image.size>1024*1024*2){
                        // throw createError(400,'File is too large . It Must be less than 2 MB');
                        throw new Error('File is too large . It Must be less than 2 MB');
                    }

                    updates.image = image;
                    user.image != 'default.png' && deleteImage (user.image);
                }

                //delete updates.email;

                const updatedUser= await User.findByIdAndUpdate(userId,updates,updateOptions).select("-password") //All user er moddo password dekte na chaile "-passowrd" likhte hoy

                if(!updatedUser){
                    throw createError(404,'User with is ID does not exits');
                }

                return updatedUser;
        
    } catch (error) {
        if(error instanceof mongoose.Error.CastError){
            throw createError(400,'Invalid Id');
        }
        throw error;
    }
}

const updateUserPasswordById = async (userId,email,oldPassword,newPassword,confirmedPassword) => {  //order important

    try {

        const user = await User.findOne({email:email});

        if(!user) {
            throw createError(404,'user is not found with this email');
        }
        
        if(newPassword !== confirmedPassword){
            throw createError(400,'new password and confirm password did not match');
        }
        
        const isPasswordMatch = await bcrypt.compare(oldPassword,user.password);
        if(!isPasswordMatch){
            throw createError (400,'Old Password is incorrect');
        }

        const updatedUser = await User.findByIdAndUpdate(userId,{password: newPassword},{new: true}).select('-password');

        await updateUserPasswordById(userId,email,oldPassword,newPassword,confirmedPassword);

        if(!updatedUser) {
            throw createError(400,'User was not updated successfully');
        }


        // return successResponse(res, {
        //     statusCode: 200,
        //     message: 'user was updated successfully',
        //     payload:{updatedUser},
           
            
        // });
        return updatedUser;
        
    } catch (error) {
        if(error instanceof mongoose.Error.CastError) {
            throw createError(400,'Invalid Id');
        }
        throw error;
    }
}

const forgetPasswordByEmail = async (email) => {  //order important

    try {

        const userData = await User.findOne({email: email});
                if(!userData) {
                    throw createError(404,'Email is incorrect or you have not verified your email address. Please register yourself first');
                }

                 //Create Json Web Token
                 const token = createJSONWebToken(
                    {email},
                    JWTResetPasswordKey,
                    '10m'
                );
                
                //prepare email or Email Sending er jonno
                const emailData={
                    email,
                    subject:"Reset Password Email",
                    html: `
                    <h2> Hellow ${userData.name} ! </h2>
                    <p> Please click here to <a href="${clientURL}/api/users/reset-password/${token}" target="_blank"> Reset your Password </a> </p>
                    `
                }


                //send email with nodemailer
               try {
              await emailWithNodeMailer(emailData)
                
               } catch (emailError) {
                next(createError(500,'Failed to send Reset Password email'));
                return;
               }
               return token;
        
    } catch (error) {
       
        throw error;
    }
}


const resetPassword = async (token,password) => {  //order important

    try {

        const decoded = jwt.verify(token,JWTResetPasswordKey);

                if(!decoded){
                    throw createError(400,"Invalid or expired token");
                }

                const filter = { email: decoded.email};
                const update = {password: password};
                const options = {new : true};
                const updatedUser = await User.findOneAndUpdate(
                    filter,update,options
                ).select('-password');

                if(!updatedUser){
                    throw createError(400,'Password reset failed');
                }

        
    } catch (error) {
       
        throw error;
    }
}




const handleUserAction = async(userId,action) =>{
    try {
        let update;
        let successMessage;
        if(action == 'ban'){
         update= {isBanned:true};
         successMessage = "User was banned successfully"
        } else if(action=='unban'){
         update ={isBanned:false};
         successMessage= "User was unbanned successfully"
        } else{
         throw createError(400,'Invalid action, Use "bann" or "unbanned" ');
        }

        // const updates= {isBanned:true}
         const updateOptions = {new: true,runValidators:true,context:'query'};

    

         const updatedUser= await User.findByIdAndUpdate(userId,update,updateOptions).select("-password") //All user er moddo password dekte na chaile "-passowrd" likhte hoy

         if(!updatedUser){
             throw createError(400,'User was not banned successfully');
         }
         return successMessage;
    } catch (error) {
        if(error instanceof mongoose.Error.CastError){
            throw createError(400,'Invalid Id');
        }
        throw (error);
        
    }
}

module.exports= { findUsers,findUserById,deleteUserById,updateUserById,updateUserPasswordById,forgetPasswordByEmail,resetPassword ,handleUserAction}