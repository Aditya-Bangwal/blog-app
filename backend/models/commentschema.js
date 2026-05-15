const mongoose=require('mongoose');
const commentschema = new mongoose.Schema(
{
    comment:{
        type:String,
        required:true,
     },
    blog:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "blogs"
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    likes:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"user",
            },
        ],
    replies:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"comment",
        }
    ],
    parentcomment:{
         type:mongoose.Schema.Types.ObjectId,
            ref:"comment",
            default:null
    }
},
{
    timestamps:true
}
)
const Comment=mongoose.model("comment",commentschema);
module.exports=Comment;