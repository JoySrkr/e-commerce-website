const express= require("express");
const cookieParser = require('cookie-parser')
const morgan = require('morgan');
const bodyParser = require('body-parser');
const createError = require('http-errors');
const xssClean = require('xss-clean');
const rateLimit = require('express-rate-limit');
const userRouter = require("./routers/userRouter");
const seedRouter = require("./routers/seedRouter");
const authRouter = require("./routers/authRouter");
const { errorResponse } = require("./controllers/responseController");
const app = express();

//Etao ekta middleware, jekono jaigai use kora jabe
const rateLimiter = rateLimit({
    windowMs: 1*60*1000, //1 minute
    max: 5, // 1 minute e 5 bar login er jonno request pathate parbe er beshi bar pathale nicher msg dekhabe
    message: 'Too many request from this IP, please try agian later', // 5 bar er besi try korle ei messege dibe
})

app.use(cookieParser());
//rateLimiter sobar jonno call korate chaile, ekhon sob gulo router 5 bar er beshi send korle rateLimiter er msg ta dekhbe
app.use(rateLimiter);

app.use(xssClean());
app.use(morgan('dev'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}));

//userRouter ta call korte chaile + /api/users eta common point tai etake agei define kore dite pari
app.use('/api/users',userRouter);
app.use('/api/auth',authRouter);
app.use('/api/seed',seedRouter);


// sudu localhost 3001/test ei webpage er jonno rateLimiter use korlam, 5 bar er beshi request send korle rateLimiter er message ta dekhabe
// app.get("/test",rateLimiter, (req,res)=>{
//     res.status(200).send({
//         message: "Get Method: api testing is working Fine",
//     });
// });


app.get("/test", (req,res)=>{  
    res.status(200).send({
        message: "Get Method: api testing is working Fine",
    });
});


//Creating Dummy Data
// const users= [
    
//     {id:1, name:'Joy Sarker'},
//     {id:2, name:'Shubam'},
//     {id:3, name:'Hemel'}
// ]

// app.get("/api/users", (req,res)=>{
//     // console.log(req.body.id); //isLoggedIn theke id r upor base kore Database theke data khuje nibe
//      res.status(200).send({
//          message: "user profile is returned",
//          users:users,
//      });
//  });

 //Client Error Handaling Middleware
 app.use((req,res,next)=>{  
    // createError(404, 'Http error ')
    // next() // Client Error Middleware Theke Server Error Middleware e jawar jonno

    //aro choto kore likte chaile
    
    next(createError(404, 'Http error, route not fount '))
})


//Server Error Handling MIddleware --> All the errors come this point
app.use((err,req,res,next)=>{  
    // console.error(err.stack);
    // res.status(500).send('Somthing is Broken')

    //responseControllers.js page theke error gulo hangle hobe tai nicher code gulo likher dorkar nai
    // return res.status(err.status || 500).json({
    //     success: false,
    //     message: err.message,
    // });

    //responseController.js theke error gulo handel hobe 
    return errorResponse(res, {
        statusCode: err.status, // err.status , err.message eigula responseController.js ei page theke asbe
        message: err.message
    })
})


module.exports = app  // eitake jate onno file theke import / require korte pari tai export korlam