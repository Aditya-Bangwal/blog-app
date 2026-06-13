const { CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = require('./dotenv.config');

const cloudinary=require('cloudinary').v2;
require("dotenv").config();
async function cloudinaryconfig(){
    try{
         cloudinary.config({ 
            cloud_name: CLOUD_NAME, 
            api_key: CLOUDINARY_API_KEY, 
            api_secret: CLOUDINARY_API_SECRET
        });

        console.log("cloudinary configuration successfull");

    }catch(err){
        console.log("error aa gya while config cloudinary");
        console.log(err);
    }
 
   
}

module.exports= cloudinaryconfig;