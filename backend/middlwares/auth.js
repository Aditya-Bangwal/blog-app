const { verifyjwt } = require("../utils/generatetoken");

const verifyuser=async(req,res,next)=>{
    console.log("in verify user");
    const authHeader = req.headers.authorization;
    console.log("authheader",authHeader);

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
       console.log(user);
       req.user=user.id;
       
       next();


    }  catch(err){

    }
}
module.exports=verifyuser;