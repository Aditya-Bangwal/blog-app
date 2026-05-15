const user=require('../models/userm');
const bcrypt=require('bcrypt');
const {generatejwt,verifyjwt} = require('../utils/generatetoken');
const transporter = require('../utils/transporter');


const admin=require("firebase-admin")
const {getAuth}=require("firebase-admin/auth");

const serviceAccount = require("../config/firebaseAdmin.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});



async function createuser(req,res){
    const{name,password,email}=req.body;
    console.log(req.body);
   
    try{
       
        if(!name || !password || !email)
        {
           return res.status(400).json({
                success:false,
                message:"please fill all fields" });
        }
       const check=await user.findOne({email});
        if(check)
        {
             if(check.googleAuth)
        {
             res.status(400).json({
            success:true,
            message:"This email alredy registered,please continue with google",
            user:{
                id :user._id,
                name:user.name,
                email:user.email,
                token
            },
            
            });

        }
            if(check.verify)
            {
                 return res.status(400).json({
                success:false,
                message:"user already registered with this email"
            })

            }
            else{
        let verificationtoken=await generatejwt({email:check.email , id :check._id });
        const sendingemail = await transporter.sendMail({
        from: '"Aditya" <adityabangwal12@gmail.com>',
        to: check.email,
        subject: "Email verification",
        text: "Hello world?", 
        html: `<h1>Click on the link to verify</h1>
               <a href="http://localhost:5173/verify-email/${verificationtoken}">Verify user</a>`,
      });
        return res.status(200).json({
            success:true,
            message:"Please check your Email to verify your account",})
        }}
       

        const hashedpassword=await bcrypt.hash(password,10);
        console.log(hashedpassword);

      const newuser=await user.create({name,email,password :hashedpassword});

      let verificationtoken=await generatejwt({email:newuser.email , id :newuser._id });
    //   console.log("inusercontroller",token);

      const sendingemail = await transporter.sendMail({
        from: '"Aditya" <adityabangwal12@gmail.com>',
        to: newuser.email,
        subject: "Email verification",
        text: "Hello world?", 
        html: `<h1>Click on the link to verify</h1>
               <a href="http://localhost:5173/verify-email/${verificationtoken}">Verify user</a>`,
      });




        return res.status(200).json({
            success:true,
            message:"Please check your Email to verify your account",
            // user:{
            //     id : newuser._id,
            //     name:newuser.name,
            //     email:newuser.email,
            //     blogs:newuser.blogs,
            //     token
            // },
            
        })

    }
    catch(err){
        res.status(500).json({
            success:false,
            message:err.message,
        })

    }

}

async function verifytoken()
{
    try {
        const {verificationtoken}=req.params
        const verifytoken=await verifyjwt(verificationtoken)
        if(!verifytoken)
        {
            return res.status(400).json(
                {
                    success:false,
                    message:"Invalid token/email expired"
                }
            )
        }

        const{id}=verifytoken
        const user=await user.findByIdAndUpdate(id,{
            verify:true
        },{new:true})
        if(!user)
        {
             return res.status(400).json(
                {
                    success:false,
                    message:"Invalid token/email expired"
                }
            )

        }
       
        return res.status(200).json(
            {
                success:true,
                message:"Email verified successfully"
            }
        )
        
    } catch (error) {
          res.status(500).json({
            success:false,
            message:err.message,
        })
        
    }

}

async function googleAuth(req,res)
{
    try {
        const {accessToken}=req.body
        const res=await getAuth().verifyIdToken(accessToken)
        const{name,email}=res

        let user=await user.findOne({email})
        if(user)
        {
            if(user.googleAuth)
            {
                let token=await generatejwt({email:user.email , id :user._id });


        res.status(200).json({
            success:true,
            message:"Loggen in successfully",
            user:{
                id :user._id,
                name:user.name,
                email:user.email,
                token
            },
            
            });

            }
            else{
                 res.status(400).json({
            success:true,
            message:"This email alredy registered,please try without google",
            user:{
                id :user._id,
                name:user.name,
                email:user.email,
                token
            },
            
            });

            }

                

        }

        let newuser=await user.create({
            name,
            email,
            googleAuth:true,
            verify:true
        })
         let token=await generatejwt({email:newuser.email , id :newuser._id });


        res.status(200).json({
            success:true,
            message:"Registered successfully",
            user:{
                id :newuser._id,
                name:newuser.name,
                email:newuser.email,
                token
            },
            
            });



        
    } catch (error) {
         res.status(500).json({
            success:false,
            message:err.message,
        })
        
    }



}

async function login(req,res)
{
    const{password,email}=req.body;
    console.log(req.body);
   
    try{
        if( !password || !email)
        {
            res.status(400).json({
                success:false,
                message:"please fill all fields" });
        }
       const check=await user.findOne({email});
        if(!check)
        {
            res.status(400).json({
                success:false,
                message:"user not  exist"
            })
        }

        if(check.googleAuth)
        {
             res.status(400).json({
            success:true,
            message:"This email alredy registered,please continue with google",
            user:{
                id :user._id,
                name:user.name,
                email:user.email,
                token
            },
            
            });

        }
        let checkforpswd=await bcrypt.compare(password,check.password);
        if(!checkforpswd)
            {
                return res.status(400).json({
                    success:false,
                    message:"Incorrect password"
                })
            }
        if(!(check.verify))
            {
                 let verificationtoken = await generatejwt({
                   email: check.email,
                   id: check._id,
                 });
                 //   console.log("inusercontroller",token);

                 const sendingemail = await transporter.sendMail({
                   from: '"Aditya" <adityabangwal12@gmail.com>',
                   to: check.email,
                   subject: "Email verification",
                   text: "Hello world?",
                   html: `<h1>Click on the link to verify</h1>
               <a href="http://localhost:5173/verify-email/${verificationtoken}">Verify user</a>`,
                 });
                //send verification email
                return res.status(400).json({
                    success:false,
                    message:"Please verify your email"
                })
            }

        

            let token=await generatejwt({email:check.email , id :check._id });


        res.status(200).json({
            success:true,
            message:"Logged in successfully",
            user:{
                id : check._id,
                name:check.name,
                email:check.email,
                token
            },
            
            });

    }
    catch(err){
        res.status(500).json({
            success:false,
            message:err.message,
        })
}}

async function getuser(req,res){
    try{
        const allusers=await user.find();
          return res.status(200).json({
            success:true,
            message:"user created successfully",
            allusers,
           })
    }
    catch(err){
        res.status(500).json({
            success:false,
            message:err.message,
        })
    }
}

async function getuserid(req,res){
    try{
        const{id}=req.params;
        // const userid=await user.findById(id);
        const userid=await user.findOne({_id: id})
      if(!userid)
      {
        return res.status(200).json({
            success:false,
            message:"user not found",
           
        })

      }
      return res.status(200).json({
        success:true,
        message:"user created successfully",
        userid
    })

     

    }
    catch(err){
        res.status(500).json({
            success:false,
            message:err.message,
        })

    }


}

async function updateuser(req,res){
    try{
       const id=req.params.id;
       const{name,email,password}=req.body;
        const userupd =await user.findOneAndUpdate({_id: id},{name,email,password});
        res.status(200).json({
            success:true,
            message:"updated user data successfully",
            userupd
        })

    }
    catch(err){
        res.status(500).json({
            success:false,
            message:err.message,
        })

    }

}

async function deleteuser(req,res){

    try{
        const id=req.params.id;
        const userdel=await user.findOneAndDelete({_id: id})
        if(!userdel)
        {
            res.status(200).json({
                success:true,
                message:"user with particular id does not exist",
                userdel
            })
        }
       
        res.status(200).json({
            success:true,
            message:"deleted successfully",
            userdel
        })

    }
    catch(err){
        res.status(500).json({
            success:false,
            message:err.message,
        })
        
    }
    
}


module.exports={createuser,getuser,getuserid,updateuser,deleteuser,login,verifytoken,googleAuth};
