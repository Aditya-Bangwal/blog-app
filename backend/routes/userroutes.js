const express=require('express');
const router=express.Router();
const {
  createuser,
  getuser,
  getuserid,
  updateuser,
  deleteuser,
  login,
  verifytoken,
  googleAuth,
  saveblog,
  followuser,
  changesavedlikeblog
} = require("../controllers/usercontroller");
const verifyuser = require('../middlwares/auth');
const upload = require('../utils/multer');

router.post('/signup',createuser);
router.post('/signin',login);
router.get('/users',getuser );
router.get('/users/:username',getuserid );
router.patch('/users/:id',verifyuser,upload.single("profilepic"),updateuser);
router.delete('/users/:id',verifyuser,deleteuser);

router.get("/verify-email/:verificationtoken",verifytoken)

router.post("/google-auth",googleAuth)

router.patch("/follow/:id",verifyuser,followuser)

router.patch("/change-saved-liked-blog",verifyuser,changesavedlikeblog)


module.exports=router;