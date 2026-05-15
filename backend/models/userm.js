const mongoose=require('mongoose');
const { googleAuth } = require('../../frontend/src/utils/firebase');
const userschema= new mongoose.Schema({
    name:String,
    email:{
        type :String,
        unique:true
    },
    password:String,
    blogs:
    [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"blogs",
    }],
    verify:{
        type:Boolean,
        default:false
    },
    googleAuth:{
        type:Boolean,
        default:false,
    }
},{timestamps:true})
const user=mongoose.model("user",userschema);
module.exports=user;
