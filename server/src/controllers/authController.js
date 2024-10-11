const createError = require('http-errors');

const jwt = require('jsonwebtoken')
//const bcrypt = require('bcrypt');
const bcrypt = require('bcryptjs');
const fs = require('fs').promises;
const User = require('../models/userModel');
const { successResponse } = require('./responseController');
const { createJSONWebToken } = require('../helper/jsonwebtoken');
const { JWTAccessKey, JWTRefreshKey } = require('../secrect');

const handleLogin = async (req,res,next)=> {
    try {
        //email,password req.body
        const {email,password}= req.body;
        //isExist
        const user = await User.findOne({email});
        if(!user) {
            throw createError(
                404,'User does not exist with this email. Please register first'
            );
        }
        //compare the password
        const isPasswordMatch = await bcrypt.compare(password,user.password)
        if(!isPasswordMatch){
            throw createError(
                401,'Email or Password does not match'
            );
        }
        //isBanned
        //const isBanned = await bcrypt.compare(password,user.password)
        if(user.isBanned){
            throw createError(
                403,'You are banned . Please contact authority'
            );
        }

        

        //token,cookie

        const accessToken = createJSONWebToken(
            //{_id:user._id},
            {user},
            JWTAccessKey,
            '15m'
        );
        res.cookie('accessToken',accessToken,{   // key and value similar typer rekhechi (accessToken)
            maxAge: 15*60*1000, // 15 minutes
            httpOnly: true,
           // secure: true,
            sameSite: 'none'
        })

        //token,cookie

        const refreshToken = createJSONWebToken(
            //{_id:user._id},
            {user},
            JWTRefreshKey,
            '7d'
        );
        res.cookie('refreshToken',refreshToken,{   // key and value similar typer rekhechi (accessToken)
            maxAge: 7*24*60*60*1000, // 7 days 
            httpOnly: true,
           // secure: true,
            sameSite: 'none'
        })

        const userWithoutPassword = await User.findOne({email}).select('-password');

        //Success Response
        return successResponse(res, {
            statusCode: 200,
            message: 'users were loggedin successfully',
            payload:{userWithoutPassword },
        });
        
    } catch (error) {
        next (error)
    }
};

const handleLogout = async (req,res,next)=> {
    try {

        //logout korar somoy jei cookie ta thake seta delete korar jonno . 
        res.clearCookie('accessToken')

        //Success Response
        return successResponse(res, {
            statusCode: 200,
            message: 'users were logged out successfully',
            payload:{ },
        });
        
    } catch (error) {
        next (error)
    }
};

const handleRefreshToken = async (req,res,next)=> {
    try {

        const oldRefreshToken = req.cookies.refreshToken;

        // verify the old refresh token
        const decodedToken = jwt.verify(oldRefreshToken,JWTRefreshKey);

        if(!decodedToken) {
            throw createError(401,"Invalid refresh token. Please login again")
        }

          //token,cookie

          const accessToken = createJSONWebToken(
            //{_id:user._id},
            decodedToken.user,
            JWTAccessKey,
            '15m'
        );
        res.cookie('accessToken',accessToken,{   // key and value similar typer rekhechi (accessToken)
            maxAge: 15*60*1000, // 15 minutes
            httpOnly: true,
           // secure: true,
            sameSite: 'none'
        })
       
        //Success Response
        return successResponse(res, {
            statusCode: 200,
            message: 'New access Token is generated',
            payload:{ },
        });
        
    } catch (error) {
        next (error)
    }
};

const handleProtectedRoute = async (req,res,next)=> {
    try {

        const accessToken = req.cookies.accessToken;

        // verify the old refresh token
        const decodedToken = jwt.verify(accessToken,JWTAccessKey);

        if(!decodedToken) {
            throw createError(401,"Invalid access token. Please login again")
        }

         
       
        //Success Response
        return successResponse(res, {
            statusCode: 200,
            message: 'Protected resources accessed successfully',
            payload:{ },
        });
        
    } catch (error) {
        next (error)
    }
};

module.exports ={handleLogin,handleLogout,handleRefreshToken,handleProtectedRoute}