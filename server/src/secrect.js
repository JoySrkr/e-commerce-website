 //sobgulo environment variabel ei jayga theke access kora jabe
require("dotenv").config();

const serverPort = process.env.SERVER_PORT||3002;
const mongodbURL = process.env.MONGODB_ATLAS_URL|| 'mongodb://localhost:27017/ecommerceMernDB';
const defaultImagePath = process.env.DEFAULT_USER_IMAGE_PATH || 'public/images/users/default.png';

const JWTActivationKey = process.env.JWT_ACTIVATION_KEY || 'ahahihaighaigag_28y2266283';
const JWTAccessKey = process.env.JWT_ACCESS_KEY || 'ahahihaighaigag_28y2266283';
const JWTRefreshKey = process.env.JWT_Refresh_KEY || 'ahahihaighaigag_28y2266283';
const JWTResetPasswordKey = process.env.JWT_RESET_PASSWORD_KEY || 'ahahihaighaigag_28y2266283';


const smtpUsername = process.env.SMTP_USERNAME || '';

const smtpPassword = process.env.SMTP_PASSWORD || '';

const clientURL = process.env.CLIENT_URL || '';

// const uploadDir=process.env.UPLOAD_FILE || 'public/images/users';



module.exports = {serverPort,mongodbURL,
     defaultImagePath,JWTActivationKey,
     smtpUsername,smtpPassword,clientURL,JWTAccessKey,JWTRefreshKey,JWTResetPasswordKey}  //Aro onk module exports kora lage te pare tai etake object create kore exports korlam