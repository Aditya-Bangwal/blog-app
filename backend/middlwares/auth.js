const { verifyjwt } = require("../utils/generatetoken");

const verifyuser=async(req,res,next)=>{
    
    const authHeader = req.headers.authorization;
   

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(400).json({
            success: false,
            message: "Please sign in",
        });
    }

    const token = authHeader.split(" ")[1];
    if(!token)
    {
        return res.status(400).json({
            success:false,
            message:"please sign in",
        })
    }
    try{
       let user= await verifyjwt(token,"jwtkabhotkhatarnaksecretbhaibhaisupersecure123!");
       if(!user){
        return res.status(400).json({
            success:false,
            message:"please sign in",
        })
       }
      
       req.user=user.id;
       
       next();


    }  catch(err){

    }
}
module.exports=verifyuser;