const express=require('express');
const router=express.Router();
const{createblog,getblog,getblogbyid,updateblog,deleteblog,likeblog,saveblog,searchblogs}=require('../controllers/blogcontroller');
const{ commentblog, deletecommentblog, editcomment,likecomment,addnestedcomment}=require('../controllers/commentcontroller');
const verifyuser = require('../middlwares/auth');
const upload = require('../utils/multer');

//blogs
router.post('/blogs',verifyuser,upload.fields([{name:"image"},{name:"images"}]),createblog);
router.get('/blogs',getblog);
router.get('/blogs/:blogId',getblogbyid);
router.patch('/blogs/:id',verifyuser,upload.fields([{name:"image"},{name:"images"}]),updateblog);
router.delete('/blogs/:id',verifyuser,deleteblog);
//like
router.post('/blogs/like/:id',verifyuser,likeblog);
//comment
router.post('/blogs/comment/:id',verifyuser,commentblog);
router.delete('/blogs/comment/:id',verifyuser,deletecommentblog);
router.patch('/blogs/comment/:id',verifyuser,editcomment);
router.patch('/blogs/comment/like/:id',verifyuser,likecomment);
//for nested comment
router.post('/blogs/comment/:parentcommentid/:id',verifyuser,addnestedcomment);

router.patch("/save-blog/:id",verifyuser,saveblog)

router.get("/search-blogs",searchblogs)

module.exports=router;