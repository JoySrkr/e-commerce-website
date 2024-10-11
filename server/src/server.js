// const express= require("express");
// const morgan = require('morgan');
// const bodyParser = require('body-parser');
// const app = express();

// app.get("/",(req,res)=>{
//     res.send("Welcome To server")
// })
//Upores moto  likleo hobe abar Nicher moto liklo hobe
// app.get("/",(req,res)=>{
//     res.status(200).send({
//         message: "Welcome To server",
//     });
// });

// app.get("/products",(req,res)=>{
//     res.send("Products are returned")
// })
//Upores moto  likleo hobe abar Nicher moto likleo hobe
// app.get("/products",(req,res)=>{
//     res.status(200).send({
//         message: "Products are returned",
//     });
// })



//app.use(morgan('dev')); //Middleware age bebohar kora lage + morgan hocche 3rd party middleware
//Application / Built in Parser Bebohar korar jonno
//app.use(express.json()); // req body te data receive korar jonno
//app.use(express.urlencoded({extended:true}));


//Body Parser bebohar korar jonno
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({extended:true}));

//Creating A Middleware Function etate req,res,next parameter gulo thake
// const isLoggedIn = (req,res,next) =>{
//     //console.log("isLoggedIn middleware");
//     const login = false;
//     if(login){
//         next()
//     }else{
//         return res.status(401).json({message: 'please login first'})
//     }
// }



// app.get("/test",(req,res)=>{
//     res.status(200).send({
//         message: "Get Method: api testing is working Fine",
//     });
// });
//isLoggedIn middeleware use korechi , ei khane onk gulo middleware use kora jete pare but abar ei /api/user ei take aste chaile Oi middleware ti te next() ei function ta use korte hobe
// app.get("/api/user",isLoggedIn, (req,res)=>{
//     console.log("user Profile");
//     res.status(200).send({
//         message: "user profile is returned",
//     });
// });

//Sobar jonno Middleware call korte chaile
//app.use(isLoggedIn)


// app.get("/api/user", (req,res)=>{
//     console.log("user Profile"); //checking after middleware is it works or not
//     res.status(200).send({
//         message: "user profile is returned",
//     });
// });


// app.post("/test",(req,res)=>{
//     res.status(200).send({
//         message: "Post Method: api testing is working Fine",
//     });
// });


// app.put("/test",(req,res)=>{
//     res.status(200).send({
//         message: "Put Method: api testing is working Fine",
//     });
// });

// app.delete("/test",(req,res)=>{
//     res.status(200).send({
//         message: "Delete Method: api testing is working Fine",
//     });
// });

//Built in Middleware req e kichu change ante chaile
// const isLoggedIn = (req,res,next) =>{
//     //console.log("isLoggedIn middleware");
//     const login = true;
//     if(login){
//         req.body.id=101;  //req e id assing korlam
//         next()
//     }else{
//         return res.status(401).json({message: 'please login first'})
//     }
// }


//Built in Middleware
// app.get("/api/users", isLoggedIn, (req,res)=>{
//    // console.log(req.body.id); //isLoggedIn theke id r upor base kore Database theke data khuje nibe
//     res.status(200).send({
//         message: "user profile is returned",
//     });
// });

//HTTP Error Handling
// app.get("/api/users", (req,res)=>{
//     // console.log(req.body.id); //isLoggedIn theke id r upor base kore Database theke data khuje nibe
//      res.status(200).send({
//          message: "user profile is returned",
//      });
//  });

//Client Error Handaling Middleware
// app.use((req,res,next)=>{
//     res.status(404).json({message: 'route not found'})
//     next() // Client Error Middleware Theke Server Error Middleware e jawar jonno
// })


//Server Error Handling MIddleware
// app.use((err,req,res,next)=>{
//     console.error(err.stack);
//     res.status(500).send('Somthing is Broken')
// })



//Uporer eto kichu likhar dorkar nai just app.js file theke call delai hobe karon ota Export kora ache + or vitore uporer sob kichu likha ache
const app=require('./app');
const connectDatabase = require('./config/db');
const { serverPort } = require('./secrect');

// app.listen(3001,()=>{  //shudu nicje fixed korte chile
//     console.log("Server is running at http://localhost:3001");
// });


// (.env) folder theke SERVER_PORT ta access korte chaile extra ar ektu kaj korte hobe
// require("dotenv").config();
//Server port number ta access korte chaile, jeta (.env) folder e save kora ache
// const port = process.env.SERVER_PORT||3002;  //Incase (.env) folder er SERVER_PORT kaj na korle alternative 3002 port ta kaj korbe

// app.listen(port,()=>{
//     console.log(`Server is running at http://localhost:${port}`);  //Must be careful about ` `and ' '
// });

//secrect.js theke serverPort accesskorte chaile line 147-154 porjonto lika lagbena. Er poriborte

app.listen(serverPort,async()=>{
    console.log(`Server is running at http://localhost:${serverPort}`);  //Must be careful about ` `and ' '
    await connectDatabase();
});