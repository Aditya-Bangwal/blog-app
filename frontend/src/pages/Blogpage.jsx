import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useParams } from 'react-router-dom'
import { addselectedblog, changeLikes, removeselectedblog, setcomments } from '../utils/selectedblogslice'
import Comment from '../components/Comment'
import { setisOpen } from '../utils/commentSlice'

// import jwt from "jsonwebtoken" 

function Blogpage() {
    
    const {id}=useParams()
    const [blogdata,setblogdata]=useState(null)
     const {likes,comments,content}=useSelector(slice=>slice.selectedBlogSlice )
     const{isOpen}=useSelector(slice=>slice.comment )
     const location=useLocation()
    const dispatch =useDispatch()
    const [islike,setislike]=useState(false)
    // const user =JSON.parse(localStorage.getItem("user"))
    // const token=JSON.parse(localStorage.getItem("token"))

    const {token,email,id:userId}=useSelector(slice=>slice.user)
    
    async function fetchblogbyid() {
        try {
            let res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/blogs/${id}`)
            console.log(res)
            console.log("blogid")
            setblogdata(res.data.blog1)
            dispatch(addselectedblog(res.data.blog1))
            if(res.data.blog1.likes.includes(userId))
            {
                setislike((prev)=>!prev)
            }
            
        } catch (error) {
            toast.error("Failed to fetch blog",error)
           
        }
    }
    

    useEffect(() => {
        fetchblogbyid()

        
        return()=>{
        console.log("current path",window.location.pathname)  //---current path
        console.log("previous path",location.pathname)   //----previous path
         dispatch(setisOpen(false))
            if(window.location.pathname != `/edit/${id}` || window.location.pathname == "/addblog")
            {
                dispatch(removeselectedblog())
            }
            
        }
    }, [id])

   //like functionality
    async function handlelike()
    {
        
        if(token)
        {
             setislike((prev)=>!prev)
             // /blogs/like/:id
             let res=await axios.post(`${import.meta.env.VITE_BACKEND_URL}/blogs/like/${blogdata._id}`,{},
              {
                headers:{
                    Authorization: `Bearer ${token}`,

                }

             })
             dispatch(changeLikes(userId))

              

             
             toast.success(res.data.message)
        }
        else{
            return toast.error("To like this post you must first sign-in")
        }

    }




  return (
    <div className='max-w-[750px] mx-auto overflow-x-hidden '>
        {
            blogdata?<div className='flex flex-col gap-4 relative overflow-hidden' >
                <h1  className='mt-10 font-bold text-6xl capitalize'>{blogdata.title}</h1>
                <h2 className='my-5 font-medium text-gray-500 text-2xl'>-by {blogdata.creator.name}</h2>
                <img className='' src={blogdata.imageurl} alt="" />
                {
                  token&&  email == blogdata.creator.email && <Link to={"/edit/"+blogdata.blogId} > <button className='bg-green-500 mt-5 px-6 py-2 text-xl'>EDIT</button></Link>
                }

                <div className='flex gap-7 mt-1'>
                <div onClick={handlelike} className='cursor-pointer flex items-center gap-1'>
                    {
                        islike?<i className="fi fi-sr-thumbs-up text-red-500 text-3xl"></i>
                        :<i className='w-3xl' className="fi fi-rr-social-network text-3xl"></i>
                    }
                    <div>
                        <p className='text-2xl'>{likes?.length}</p>
                    </div>
                     
                    
               </div>
              
               
               <div className='flex items-center gap-1'>
                   <div onClick={()=>{
                    dispatch(setisOpen())
                   }}>
                       <i className="fi fi-sr-comment-alt text-3xl"></i>
                   </div>
                   <div>
                       <p className='text-2xl'>{comments.length}</p>
                   </div>




                   
                        
               </div>
               
               </div>
                 <div className='my-10'>
            {
                
                content?.blocks?.map( (block)=>{
                    if(block.type=="header")
                    {
                        if(block.data.level==2)
                        {
                            return <h2 className='font-bold text-4xl my-4' dangerouslySetInnerHTML={{__html : block.data.text}}></h2>

                        }else if(block.data.level==3)
                        {
                            return <h3 className='font-bold text-3xl my-4' dangerouslySetInnerHTML={{__html : block.data.text}}></h3>

                        }
                        else if(block.data.level==4)
                        {
                            return <h4 className='font-bold text-2xl my-4' dangerouslySetInnerHTML={{__html : block.data.text}}></h4>

                        }
                      


                    }else if(block.type=="paragraph")
                    {
                        return <p className='my-4' dangerouslySetInnerHTML={{__html : block.data.text}}></p>
                    }
                    else if(block.type=="image")
                    {
                        return (
                        <div>
                            <img className='my-4' src={block.data.file.url} alt="" />
                            <p className='my-2 text-center'>{block.data.caption}</p>
                        </div>)
                    }
                })
            }

        </div>

               
            </div>:<h1>Loading...</h1>

            
        }
        {
            isOpen && <Comment/>

        }

      
        
    </div>
  )
}

export default Blogpage