const mongoose = require ("mongoose");
const { mongodbURL } = require("../secrect");
const connectDatabase = async(options={}) => {
        try{
            await mongoose.connect(mongodbURL,options)  // connect function e parameter pass kora lagte pare tai async er vitor options parameter likha laglo exp: async(options={})
            console.log("Connection to DB is Successful");

            //Kono error dora porle console log er maddome dekhate chachi
            mongoose.connection.on('error', (error) =>{
                console.error('DB connection Error: ',error);

            })

        }
        catch(error){
            console.error('Can not connect to the DB: ',error.toString()); //Error ta ke String e conver kore nibe

        }
}

module.exports = connectDatabase;