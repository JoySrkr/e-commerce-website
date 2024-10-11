const multer = require("multer");
// const path=require('path'); // Image ke String akare save korte chaile
// const createError= require('http-errors'); // Image ke String akare save korte chaile
//const { UPLOAD_USER_IMG_DIRECTORY, ALLOWED_FILE_TYPES, MAX_FILE_SIZE } = require("../config"); // Image ke String akare save korte chaile
const {ALLOWED_FILE_TYPES, MAX_FILE_SIZE } = require("../config");
// const { uploadDir } = require("../secrect")

// const MAX_FILE_SIZE=process.env.MAX_FILE_SIZE || 2097152;  //1024*1024*2=2 MB
//const MAX_FILE_SIZE=Number(process.env.MAX_FILE_SIZE) || 2097152;
//Kon kon type er file upload korte parbo ta bole dilam
//const ALLOWED_FILE_TYPES = process.env.ALLOWED_FILE_TYPES || ['jpg','jpeg','png']
//const UPLOAD_DIR =uploadDir;
//const UPLOAD_DIR=process.env.UPLOAD_DIRECTORY || 'public/images/users'

// *   Image ke String akare save korte chaile nicher code likh te hobe
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, UPLOAD_USER_IMG_DIRECTORY)
//     },
//     filename: function (req, file, cb) {
//       const extname =path.extname(file.originalname); //image file er extension dite chaile
//       cb(null,Date.now()+"-"+file.originalname.replace(extname,'')+extname)
//     }
//   })
  //filtering er kaj korte chaile
  // const fileFilter = (req,file,cb) =>{
  //   const extname =path.extname(file.originalname);
  //   if(!ALLOWED_FILE_TYPES.includes(extname.substring(1))) //substring (1) dara image file er extention jemon .jpeg bujay
  //   {
  //       //Ei vabeo kora jai
  //       // const error=createError(400,'File type is not allowed')
  //       // return cb(error)
  //       //Ei vabeo kora jai
  //       return cb(new Error('File type is not allowed'),
  //   false);
  //   }
  //   cb(null,true)
  // }; 
  // const upload = multer({ storage: storage,
  //   limits: {fileSize:MAX_FILE_SIZE},
  //   fileFilter,
  //  });  */


  // Image ke binary file akare save korte chaile
const storage = multer.memoryStorage()

const fileFilter = (req,file,cb) =>{
  if(!file.mimetype.startsWith("image/")){
    return cb(new Error ('Only image files are allowed'),false);
  }
  if(file.size>MAX_FILE_SIZE){
    return cb(new Error ('File size is bigger than maximum limit size'),false);
  }
  if(!ALLOWED_FILE_TYPES.includes(file.mimetype)){
    return cb(new Error ('File type is not allowed'),false);
  }
  cb(null,true);
};


  
  const upload = multer({ storage: storage,
    fileFilter:fileFilter


   });

  module.exports =upload;