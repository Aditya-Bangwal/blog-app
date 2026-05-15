const jwt=require('jsonwebtoken');
require("dotenv").config();
async function generatejwt(payload){
    let token =await jwt.sign(payload,process.env.JWT_SECRET)
    return token;


}
async function verifyjwt(token){
    let res=true;
    try{
        let isvalid =await jwt.verify(token,process.env.JWT_SECRET)
        return isvalid;
    }
    catch(err){
        return false;
       }
}

async function decodejwt(token){
    let decoded =await jwt.decode(token);
    return decoded;
}
module.exports={generatejwt,verifyjwt,decodejwt};