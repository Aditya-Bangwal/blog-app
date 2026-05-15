const blog = require('../models/blogm');
const Comment=require('../models/commentschema');
const user = require('../models/userm');
const{verifyjwt, decodejwt}=require('../utils/generatetoken');
const {uploadimage,deleteimagefromcloud} = require('../utils/uploadimage');
const fs=require('fs');
const uniqueId=require("uniqid")
const ShortUniqueId = require('short-unique-id');
const uid = new ShortUniqueId({ length: 10 });
const { randomUUID } = new ShortUniqueId({ length: 10 });
async function createblog(req,res)
{
    try{
        const creator =req.user;
        const{title,description,draft}=req.body;
        const {image,images}=req.files;
        console.log(image);
        const content=JSON.parse(req.body.content)
        let imageIndex=0
        for(let i=0;i<content.blocks.length;i++)
        {const block=content.blocks[i]
            if(block.type==="image")
            {
                 const file = images[imageIndex]; 
                const {secure_url,public_id}=await uploadimage(
                    `data:image/jpeg;base64,${images[imageIndex].buffer.toString("base64")}`
                )
                block.data.file={
                    url:secure_url,
                    imageid:public_id
                }
                console.log(secure_url,public_id)
                imageIndex++;
            }
        }

        const{secure_url,public_id}=await uploadimage(
            `data:image/jpeg;base64,${image[0].buffer.toString("base64")}`

        )
        console.log({title,description,draft,image});
        console.log(req.body);
        console.log(content.blocks[0].data.file)
        if(!title || !description)
        {
           return res.status(404).json({
                success:false,
                message:"give all parameters listed",
            })
    
         }
         const finduser=await user.findById(creator);
         if(!finduser)
         {
           return res.status(400).json({
                success:false,
                message:"i dont know you biatch fuck off"
            })
         }
           if(!content)
         {
           return res.status(400).json({
                success:false,
                message:"content not found"
            })
         }
         //const user=await uploadimage(im);
         //const {secure_url,public_id}=await uploadimage(image.path);
         console.log({secure_url,public_id});

         //fs.unlinkSync(image.path);
         const blogId=title.toLowerCase().replace(/ +/g,"-")+ "-"+randomUUID()

         
         const newblog=await blog.create({
            title,description,draft,creator,imageurl:secure_url,imageid:public_id,blogId,content});

        await user.findByIdAndUpdate(creator, {
            $push: { blogs: newblog._id }
        });
        res.status(200).json({
            success:true,
            message:"new blog created",
            newblog
        })
        

    }catch(err)
    {
        res.status(500).json({
            success:false,
            message:err.message
        })
    }
   
}


async function getblog(req,res)
{
    try{
        const allblog=await blog.find({})
        .populate(
        {
        path:"creator",
        select:"-password"
        }
    ).populate({
            path:"likes",
            select:"email name"
        });
        res.status(200).json({
            success:true,
            message:"task successful",
            allblog
        })

    }catch(err)
    {
        res.status(500).json({
            success:false,
            message:err.message
        })
    }

}

async function getblogbyid(req,res)
{
    try{
        const {blogId}=req.params;
        console.log("blogId",blogId)
        const blog1 = await blog.findOne({ blogId })
.populate({
    path:"comments",
    populate:{
        path:"user",
        select:"name email"
    },
})
.populate({
    path:"creator",
    select:"name email"
})
.lean();

if(!blog1)
{
    return res.status(404).json({
        success:false,
        message:"blog not found"
    })
}
        

        async function populatereplies(comments)
        {
            for(const comment of comments)
            {
                let populatedcomment=await Comment.findById(comment._id).populate({
            path:"replies",
            populate:
            {
                path:"user",
                select:"name email"
            },
            }).lean()
           comment.replies = populatedcomment.replies || [];
             
               if(comment.replies && comment.replies.length >0)
               {
                await populatereplies(comment.replies)
 
                 }
            }
           
            return comments

        }

         blog1.comments = await populatereplies(blog1.comments);
         console.log("after filling",blog1)

       



        if(!blog1)
        {
             return res.status(404).json({
            success:true,
            message:"blog not found",
            blog1
        })

        }


        return res.status(200).json({
            success:true,
            message:"task successful user founded by this particular id",
            blog1
        })



    }catch(err)
    {
        res.status(500).json({
            success:false,
            message:err.message +"its not working"
        })
    }

}

async function updateblog(req,res)
{
    try{
        const creator=req.user;
        
        const {id}=req.params;
        console.log("in updateblog",id)
       
         const{title,description,draft}=req.body;
        //  const image=req.files
         const content=JSON.parse(req.body.content)
         const existingimages=JSON.parse(req.body.existingimages)

        //  const user1=await user.findById(creator).select("-password");
        

        const blog1=await blog.findOne({blogId:id});
        if(!blog1)
        {
            return res.status(500).json({
                message:"blog not found",
            })
        }
        let imagestodelete=blog1.content.blocks
        .filter((block)=>block.type=="image")
            .filter((block)=>
                !existingimages.find(({url})=>url==block.data.file.url)
        )
        .map((block)=>block.data.file.imageid)

        if(imagestodelete.length>0)
        {
            await Promise.all(
                imagestodelete.map((id)=>deleteimagefromcloud(id))
            )
        }

        if(req?.files?.images)
        {
             let imageIndex=0
        for(let i=0;i<content.blocks.length;i++)
        {const block=content.blocks[i]
            if(block.type==="image" && block.data.file.image)
            {
                 const file = req?.files?.images[imageIndex]; 
                const {secure_url,public_id}=await uploadimage(
                    `data:image/jpeg;base64,${req.files.images[imageIndex].buffer.toString("base64")}`
                )
                block.data.file={
                    url:secure_url,
                    imageid:public_id
                }
                console.log(secure_url,public_id)
                imageIndex++;
            }
        }



        }
        

        console.log(blog1);
        if(!(creator==blog1.creator)){
            return res.status(500).json({
                message:"you are not authorized",
            })
        }
        
        // const updateblog=await blog.findByIdAndUpdate(id,{title,description,draft},{new:true});
        if(req?.files?.image)
        {
            await deleteimagefromcloud(blog1.imageid)
            const {secure_url,public_id}=await uploadimage(`data:image/jpeg;base64,${req.files.image[0].buffer.toString("base64")}`);
            blog1.imageurl=secure_url;
            blog1.imageid=public_id;
            // fs.unlinkSync(image.path);
        }
        blog1.title=title||blog1.title
        blog1.description=description||blog1.description
        blog1.draft=draft||blog1.draft
        blog1.content=content || blog1.content
        await blog1.save();
        res.status(200).json({
            success:true,
            message:"task successful user founded by this particular id and updated",
            blog:blog1
        })


    }catch(err)
    {
        res.status(500).json({
            success:false,
            message:err.message
        })
    }

}





async function deleteblog(req,res)
{
    try{
        const creator=req.user;
        const id=req.params.id;
        const blog1=await blog.findById(id);
        if(!blog1)
        {
            return res.status(400).json({
                message:"blog is not found please do something different",
            })

        }
        if(!(creator==blog1.creator)){
            return res.status(400).json({
                message:"you are not authorized for this action",
            })
        }
        await deleteimagefromcloud(blog.imageid)
        const deletedblog=await blog.findByIdAndDelete(id);
        const user1=await user.findByIdAndUpdate(creator,{$pull:{blogs:id}});
        return res.status(200).json({
            success:true,
            message:"task successful user founded by this particular id and deleted",
            blog:deletedblog
        })
        

    }catch(err)
    {
       return res.status(500).json({
            success:false,
            message:err.message
        })
    }

}

async function likeblog(req,res)
{
    try{
        const creator=req.user;
        const id=req.params.id;
       
        const blog1=await blog.findById(id);
        if(!blog1)
        {
            return res.status(400).json({
                message:"blog is not found please do something different",
            })

        }

        if(!blog1.likes.includes(creator))
        {
            await blog.findByIdAndUpdate(id,{$push:{likes:creator}})
            return res.status(200).json({
                success:true,
                message:"blog liked successfully",
                isliked:true

            })
        }
        else{
            await blog.findByIdAndUpdate(id,{$pull:{likes:creator}})
            return res.status(200).json({
                success:true,
                message:"blog disliked successfully",
                isliked:false
            })

        }






        // if(!(creator==blog1.creator)){
        //     return res.status(400).json({
        //         message:"you are not authorized for this action",
        //     })
        // }
        // const deletedblog=await blog.findByIdAndDelete(id);
        // const user1=await user.findByIdAndUpdate(creator,{$pull:{blogs:id}});
        // return res.status(200).json({
        //     success:true,
        //     message:"task successful user founded by this particular id and deleted",
            
        // })
        

    }catch(err)
    {
       return res.status(500).json({
            success:false,
            message:err.message
        })
    }

}




module.exports={createblog,getblog,getblogbyid,updateblog,deleteblog,likeblog};