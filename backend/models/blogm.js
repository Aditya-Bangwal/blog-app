const mongoose=require('mongoose');
const blogschema = new mongoose.Schema({
    title:{
        type:String,
        trim:true,
        required:true,
    },

    description:{
        type:String,
        require:true,
    },
     content :{
        type:Object,
        require:true,
        
     },
    blogId:{
         type:String,
        require:true,
        unique:true
    },
    imageurl:{
        
         

    },
    imageid:{
        type:String,
        require:true,
     },
    draft:{
        type:Boolean,
        default:false,
    },
    creator:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "user",
        required:true

    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"user",
        },
    ],
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"comment"
        },
    ],

    totalsaves:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"user"
        }

    ],
     totalSaves: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    tags:
        {
            type:[String]
        }
    

},
{timestamps:true}
)
const blog=mongoose.model("blogs",blogschema);
module.exports=blog;