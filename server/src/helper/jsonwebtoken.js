const jwt= require('jsonwebtoken');
const createJSONWebToken = (payload,secretKey,expiresIn)=>{
    // var token= jwt.sign({foo:'bar'},'shhhhh',{expiresIn:'10m'}); //Token ta 10 minutes er jonno valid thakbe
    if(typeof payload ==! 'object' || !payload){
        throw new Error ('Payload must be a non-empty object')
    }

    if(typeof secretKey ==! 'string' || secretKey == ''){
        throw new Error ('Payload must be a non-empty object')
    }

   try {
    const token= jwt.sign(payload,secretKey,{expiresIn});
    return token;

   } catch (error) {
    console.error('Failed to sign the JWT: ',error);
    throw error;
   }
};

module.exports = {createJSONWebToken};