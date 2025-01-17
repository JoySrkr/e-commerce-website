const data = require("../data");
const User = require("../models/userModel")

const seedUser = async(req,res,next)=>{
    try{
        //Deleting all existing users    
        await User.deleteMany({})

        //Inserting New Users
        const users= await User.insertMany(data.users);

        //Successful Response
        return res.status(201).json(users)



    }catch(error) {
        next(error);
    }
}

module.exports = { seedUser}