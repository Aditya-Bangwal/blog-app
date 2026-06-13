const mongoose=require('mongoose');
const { DB_URL } = require('./dotenv.config');
require("dotenv").config();

async function dbconnect(){
    try{
        console.log("DB_URL",DB_URL);
        await mongoose.connect(DB_URL)
              console.log("DB connected succesfully");
        }
    catch(error)
    {
        console.log("DB_URL",DB_URL);
        console.log("error aa gya");
        console.log(error);
    }
 

}
module.exports=dbconnect;