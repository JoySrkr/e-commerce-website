const createError = require('http-errors');
const mongoose = require('mongoose');

//const User = require("../models/userModel");

const findWithId = async(Model,id, options={}) =>{
    try{

        
        const item = await Model.findById(id,options);

    //jodi kono user na pay
    if(!item) {
         throw createError(404,`${Model.modelName} does not exist with this id`);
        }
         return item;
    } catch(error){
        if (error instanceof mongoose.Error){
            throw createError(400,'Invalid Item Id');
        }
        throw error;
    }


};

module.exports = {findWithId};