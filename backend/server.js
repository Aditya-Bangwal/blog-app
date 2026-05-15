require("dotenv").config()//env file object
const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');
const app=express();
app.use(express.json());
app.use(cors());
const dbconnect=require('./config/dbConnect');
const user=require('./models/userm');
const userroutes=require('./routes/userroutes');
const blogroutes=require('./routes/blogroutes');
const cloudinaryconfig = require('./config/cloudinary');

console.log("DB_URL:", process.env.DB_URL);

 app.use('/u',userroutes);
app.use('/b',blogroutes);



const PORT=process.env.PORT
app.use('/',(req,res)=>{
    res.send("its working fine i guess....");
})

app.listen(PORT,()=>{
    console.log("server started....");
    dbconnect();
    cloudinaryconfig();
})
