const blog = require('../models/blogm');
const Comment=require('../models/commentschema');
const user = require('../models/userm');
const{verifyjwt, decodejwt}=require('../utils/generatetoken');

async function commentblog(req,res)
{
    try{
        const creator=req.user;
        const id=req.params.id;
        const comment = req.body?.comment; // safer optional chaining

        if (!comment || comment.trim() === '') {
            return res.status(400).json({
                message: "please enter the comment",
            });

        }

        const blog1=await blog.findById(id);
        if(!blog1)
        {
            return res.status(400).json({
                message:"blog is not found please do something different",
            })

        }
        const newcomment=await Comment.create
        ({
            comment,blog:id,user:creator
        }).then((comment)=>{
            return comment.populate(
                {
                    path:"user",
                    select:"name email"
                }
            )
        });
        console.log("newcomment",newcomment)

        const addcomment=await blog.findByIdAndUpdate(id,{$push : {comments:newcomment._id}})
       
        return res.status(200).json({
            success:true,
            message:"comment added successfully",
            newcomment: newcomment
        })

    
    }
     catch(err)
    {
       return res.status(500).json({
            success:false,
            message:err.message
        })
    }

}

async function deletecommentblog(req,res)
{
    try{
        const creator=req.user;
        const {id}=req.params;


        const comnt=await Comment.findById(id).populate({
            path:"blog",
            select:"creator"
        });
        if(!comnt)
        {
            return res.status(400).json({
                message:"comment not found",
            })

        }

        if(comnt.user!=creator && comnt.blog.creator!=creator){
            return res.status(400).json({
                message:"you are not authorised to delete this shit",
            })

        }

         async function deletecommentandreplies(id){
            let comment=await Comment.findById(id)

            for(let replyid of comment.replies)
            {
                await deletecommentandreplies(replyid)

            }
            if(comnt.parentcomment)
            {
                await Comment.findByIdAndUpdate(comment.parentcomment,{$pull : {replies:id},})
            }
             await Comment.findByIdAndDelete(id);

         }

         await deletecommentandreplies(id)
        await Comment.deleteMany({_id:{$in:Comment.replies}})

        await blog.findByIdAndUpdate(comnt.blog._id,{$pull:{comments:id}});
        
       
        // const newcomment=await Comment.create({comment,blog:id,user:creator});

        // const addcomment=await blog.findByIdAndUpdate(id,{$push : {comments:newcomment._id}})
        return res.status(200).json({
            success:true,
            message:"comment deleted successfully",
        })

    
    }
     catch(err)
    {
       return res.status(500).json({
            success:false,
            message:err.message
        })
    }

}

async function editcomment(req,res){
    try{
        const creator=req.user;
        const {id}=req.params;
        const {updcomment} = req.body; // safer optional chaining

        if (!updcomment || updcomment.trim() === '') {
            return res.status(400).json({
                message: "please enter the comment",
            });

        }
        const comment1=await Comment.findById(id);

        if(!comment1){
            return res.status(400).json({
                message: "comment is not found",
            });
        }

       if(comment1.user!=creator){
        return res.status(400).json({
            success:false,
            message: "you are not valid for editing the comment",
        });
    }
    const updatedcomment = await Comment.
    findByIdAndUpdate(id,{comment:updcomment},{new:true}).then((comment)=>{
            return comment.populate(
                {
                    path:"user",
                    select:"name email"
                }
            )
        });


        return res.status(200).json({
            success:true,
            message:"comment updated successfully",
            updatedcomment

        })

    
    }
     catch(err)
    {
       return res.status(500).json({
            success:false,
            message:err.message
        })
    }

}


async function likecomment(req,res)
{
    try{
        const creator=req.user;
        const id=req.params.id;
        const comment1=await Comment.findById(id);
        if(!comment1)
        {
            return res.status(400).json({
                message:"comment is not found please do something different",
            })

        }

        if(!comment1.likes.includes(creator))
        {
            await Comment.findByIdAndUpdate(id,{$push:{likes:creator}})
            return res.status(200).json({
                success:true,
                message:"Comment liked successfully",
            })
        }
        else{
            await Comment.findByIdAndUpdate(id,{$pull:{likes:creator}})
            return res.status(200).json({
                success:true,
                message:"Comment disliked successfully",
            })
        }

    }catch(err)
    {
       return res.status(500).json({
            success:false,
            message:err.message
        })
    }

}

async function addnestedcomment(req,res)
{
    try{
        const userid=req.user;
        const {id:blogid,parentcommentid}=req.params;
        const comment1=await Comment.findById(parentcommentid);
        const blog1=await blog.findById(blogid);
        const {reply}=req.body
        if(!comment1)
        {
            return res.status(400).json({
                message:"comment is not found please do something different",
            })

        }
        if(!blog1)
        {
            return res.status(400).json({
                message:"comment's blog is not found please do something different",
            })

        }

        const newreply=await Comment.create({
            blog:blogid,
            comment:reply,
            parentcomment:parentcommentid,
            user:userid
        }).then((reply)=>{
            return reply.populate(
                {
                    path:"user",
                    select:"name email"
                }
            )
        })

        await Comment.findByIdAndUpdate(parentcommentid,{$push:{replies:newreply._id}})
         return res.status(200).json({
            success:true,
            message:"replied successfully",
            newreply
        })


   

    }catch(err)
    {
       return res.status(500).json({
            success:false,
            message:err.message
        })
     }

}



module.exports={commentblog,deletecommentblog,editcomment,likecomment,addnestedcomment};
