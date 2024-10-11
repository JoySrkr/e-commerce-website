
// const users= [
    
//     {id:1, name:'Joy Sarker'},
//     {id:2, name:'Shubam'},
//     {id:3, name:'Hemel'}
// ]

// // Outside e use korte chaile
// module.exports = users;

const {Schema, model} = require("mongoose")
const bcrypt = require('bcryptjs');
const { defaultImagePath } = require("../secrect");

const userSchema =new Schema({
    // name: String,
    // email:String,  eivabe dileo hobe but ami cacchi data jate validation formate e thake tai nicher moto kore likhte hobe
    name : {
        type: String,
        require: [true,'User Name is required'],  // Name na thake ekta messege dite chai
        trim: true, // Surur dike ba sesh er dike jodi space o dey trim er maddome sei space gulo cancel hoye jabe
        minlength: [3, 'The minimum name length is 3'],
        maxlength: [31,'User name Maximum length is 31 character']
    },

    email : {
        type: String,
        require: [true,'User Email is required'],  // Name na thake ekta messege dite chai
        trim: true, // Surur dike ba sesh er dike jodi space o dey trim er maddome sei space gulo cancel hoye jabe
        unique: true,
        lowercase: true,
       validate: {
        validator: function (v)  {
            return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: 'Please Enter a valid Email'
       }
    },
    

    password : {
        type: String,
        require: [true,'User Password is required'], // Name na thake ekta messege dite chai
         minlength: [6, 'The minimum password length is 6'],
         set: (v) => bcrypt.hashSync(v,bcrypt.genSaltSync(10)),  //10 bar hashing korte chachi
        
    },
    image : {
       // type: String,
      // default: defaultImagePath,


       //Image ke BInary file/ Buffer niya kaj korte chaile type change korte hobe
        type: Buffer,
        contentType: String,
        required: [true,'User image is required'],

         
    },
    address: {
        type:String,
        required: [true,'User Address is required'],
        minlength: [3, 'The minimum address length is 3'],
    },
    phone: {
        type:String,
        require: [true,'User Phone is required'],
    },

    isAdmin: {
        type:Boolean,
        default:false
    },

    isBanned:{
        type:Boolean,
        default: false
    },

    
},{timestamps:true});

const User = model('Users',userSchema);
module.exports = User;