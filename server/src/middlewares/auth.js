const createError=require('http-errors')
const jwt = require('jsonwebtoken');
const { JWTAccessKey } = require('../secrect');
const isLoggedIn = async (req,res,next) => {
    try {
        const accessToken =req.cookies.accessToken;
        //console.lot(token);
        //kono rakone Token pawa na gele
        if(!accessToken){
            throw createError(401,'Access Token Not Found . Please Login')

        }
        //token thakele setake verify kore nite chaile
        const decoded = jwt.verify(accessToken, JWTAccessKey);
        if(!decoded) {
            throw createError(401,'Invalid Access Token Please Login again')
        }
        //req.body.userId = decoded._id;
        //req.user=decode.user;
        //console.log(decoded.user)
        req.user=decoded.user;

        next()


    } catch (error) {
        return next(error);

    }
}

const isLoggedOut = async (req,res,next) => {
    try {
        const accessToken =req.cookies.accessToken;
        
        //console.lot(token);
        //kono rakone Token pawa na gele
        if(accessToken){
           try {
             //Access token verify korar jonno
             const decoded = jwt.verify(accessToken,JWTAccessKey);
             if(decoded){
                 throw createError(400,'User is Already Logged In')
 
             }
            
           } catch (error) {
            //return next(error);
            throw error;
           }
           

        }
        next()


    } catch (error) {
        return next(error);

    }
}

const isAdmin = async (req,res,next) => {
    try {
       console.log(req.user.isAdmin)
       if(!req.user.isAdmin){
        throw createError(403,'Forbidden. You Must Be an Admin');
       }
        next()


    } catch (error) {
        return next(error);

    }
}

module.exports={isLoggedIn, isLoggedOut,isAdmin};