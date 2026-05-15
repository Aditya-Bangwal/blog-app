const express=require('express');
const router=express.Router();
const{createuser,getuser,getuserid,updateuser,deleteuser,login,verifytoken, googleAuth}=require('../controllers/usercontroller');

router.post('/signup',createuser);
router.post('/signin',login);
router.get('/users',getuser );
router.get('/users/:id',getuserid );
router.patch('/users/:id',updateuser);
router.delete('/users/:id',deleteuser);

router.get("/verify-email/:verificationtoken",verifytoken)

router.post("/google-auth",googleAuth)


module.exports=router;