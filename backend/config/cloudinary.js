const cloudinary=require('cloudinary').v2;
require("dotenv").config();
async function cloudinaryconfig(){
    try{
         cloudinary.config({ 
            cloud_name: process.env.CLOUD_NAME, 
            api_key: process.env.CLOUDINARY_API_KEY, 
            api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
           
        });

        console.log("cloudinary configuration successfull");

    }catch(err){
        console.log("error aa gya while config cloudinary");
        console.log(err);
    }
 
   
}

module.exports= cloudinaryconfig;