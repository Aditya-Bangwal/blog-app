const mongoose=require('mongoose');
const likeschema = new mongoose.Schema(
{
    blog:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "blogs"
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }
},
{
    timestamps:true
}
)
const likemodel=mongoose.model("like",likeschema);
module.exports=likemodel;