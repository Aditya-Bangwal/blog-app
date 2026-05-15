const mongoose=require('mongoose');
require("dotenv").config();

async function dbconnect(){
    try{
       await mongoose.connect(process.env.DB_URL)
              console.log("DB connected succesfully");
        }
    catch(error)
    {
        console.log("error aa gya");
        console.log(error);
    }
 

}
module.exports=dbconnect;