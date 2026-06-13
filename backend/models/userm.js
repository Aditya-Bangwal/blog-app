const mongoose=require('mongoose');
const { googleAuth } = require('../../frontend/src/utils/firebase');
const userschema= new mongoose.Schema({
    name:{
        type :String,
        unique:true
    },
    email:{
        type :String,
        unique:true
    },
    username:{
        type:String,
        required:true,
        unique:true

    },
    password:{
        type :String,
        unique:true,
        select :false
    },
    blogs:
    [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"blogs",
    }],
    verify:{
        type:Boolean,
        default:false,
        select :false
    },
    googleAuth:{
        type:Boolean,
        default:false,
        select :false
    },
    profilepic:{
        type:String,
        default:null
    },
     profilepicid:{
        type:String,
        default:null
    },
    bio:{
        type:String,
    },
    followers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"user"
        }
    ],
    following:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"user"
        }
    ],
    saveBlogs:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"blogs",
    }
],
likeBlogs:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"blogs",
    }
],
showlikeBlogs:{
    type:Boolean,
    default:true
},
showsavedBlogs:{
    type:Boolean,
    default:false
},


},{timestamps:true})
const user=mongoose.model("user",userschema);
module.exports=user;
