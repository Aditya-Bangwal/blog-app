import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatdate } from '../utils/formatdate'

function Homepage() {
    const [blogs,setblogs]=useState([])
    async function fetchblogs() {
        let res= await axios.get(`${import.meta.env.VITE_BACKEND_URL}/blogs`)
        console.log(res.data.allblog)

        setblogs(res.data.allblog)

        
    }

    useEffect(()=>{
        fetchblogs()
    },[])

  return (
    <div className='w-[50%] mx-auto'>
       {
        blogs?.map(blog=>(
     <Link to={"blog/"+blog.blogId}>
        <div key={blog._id} className='w-full my-7 flex justify-between'>
        <div className='w-[60%] flex flex-col gap-2'>
            <div>
                <img src="" alt="" />
                <p>{blog.creator.name}</p>
            </div>
            <h2 className='font-bold text-xl'>{blog.title}</h2>
            <h4 className='line-clamp-2'>{blog.description}</h4>
            <div className='flex gap-5'>
                   <div className='flex gap-7 mt-1'>
                    <p>{formatdate(blog.createdAt)}</p>
                <div className='cursor-pointer flex items-center gap-1'>
                    {
                        <i className="fi fi-sr-thumbs-up text-red-500 "></i>
                    }
                    <div>
                        <p className='text-xl'>{blog.likes.length}</p>
                    </div>
                     
                    
               </div>
              
               
               <div className='flex items-center gap-1'>
                   <div>
                       <i className="fi fi-sr-comment-alt "></i>
                   </div>
                   <div>
                       <p className='text-xl'>{blog.comments.length}</p>
                   </div>
                        
               </div>
               
               </div>
            </div>
        </div>
        <div className='w-[25%]'>
            <img src={blog.imageurl} alt="" />
        </div>
        </div>
     </Link>

        ))
       }
    </div>
  )
}

export default Homepage