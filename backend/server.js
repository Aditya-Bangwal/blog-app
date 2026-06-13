require("dotenv").config()//env file object
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");
const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');
const app=express();
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      process.env.FRONTEND_URL,
    ],
    credentials: true,
  })
);
const dbconnect=require('./config/dbConnect');
const user=require('./models/userm');
const userroutes=require('./routes/userroutes');
const blogroutes=require('./routes/blogroutes');
const cloudinaryconfig = require('./config/cloudinary');
const { PORT } = require("./config/dotenv.config");



 app.use('/u',userroutes);
app.use('/b',blogroutes);



const port=PORT
app.get('/', (req, res) => {
    res.send("Blog API is running");
});

app.listen(port,()=>{
    console.log("server started....");
    dbconnect();
    cloudinaryconfig();
})
