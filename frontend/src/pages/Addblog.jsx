import axios from 'axios'
import React, { use, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { data, Navigate, useNavigate, useParams } from 'react-router-dom'
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import EditorjsList from '@editorjs/list';
import CodeTool from '@editorjs/code';
import Marker from '@editorjs/marker';
import Underline from '@editorjs/underline';
import Embed from '@editorjs/embed';
import RawTool from '@editorjs/raw';
import TextVariantTune from '@editorjs/text-variant-tune';
import ImageTool from '@editorjs/image';


function Addblog() {
   
    const {id}=useParams()
    const {title, description,imageurl,content}=useSelector(slice=>slice.selectedBlogSlice)
    const editorref=useRef(null)
    const formData=new FormData()


    const {token} =useSelector(slice=>slice.user)
    console.log("id...",id)
     const navigate=useNavigate()
    const[blogData,setblogdata]=useState({
            title:"",
            description:"",
            image :null,
            content:{
   blocks:[]
}
        })
    async function handlepostblog()
    {
        formData.append("title",blogData.title)
        formData.append("description",blogData.description)
        formData.append("image",blogData.image)
        formData.append("content",JSON.stringify(blogData.content))
        let images=[]
        blogData?.content?.blocks?.forEach((block)=>{
            if(block.type=="image")
            {
                images.push(block.data.file.image)
                 formData.append("images",block.data.file.image)

            }
        })
        try {
        const res=await axios.post(`${import.meta.env.VITE_BACKEND_URL}/blogs`,
            formData,
         {headers:
            {"Content-Type":"multipart/form-data",
             Authorization:`Bearer ${token}`
            }})
            console.log(res)
        //   URL.createObjectURL(blogData.image)
         toast.success(res.data.message)
         navigate('/')
      } catch (error) {
        toast.error(error)
        
    }
  }



    async function fetchblogbyid() {
       

              setblogdata({
                title:title,
                description:description,
                image:imageurl,
                content:content,
                
            })
           
    }
    useEffect(() => {
        if(id)
        {
            fetchblogbyid()
        }
         else
    {
        setblogdata({
            title:"",
            description:"",
            image:null,
            content:{
                blocks:[]
            }
        })

      
    }
         
    }, [id])




    
     async function handleupdateblog()
    {
      const formdata=new FormData()
      formdata.append("title",blogData.title)
      formdata.append("description",blogData.description)
      formdata.append("image",blogData.image)
      formdata.append("content",JSON.stringify(blogData.content))

      for(let data of formdata.entries())
      { 
        console.log(data)
      }
        let existingimages=[]
       let images=[]
        blogData.content.blocks.forEach((block)=>{
            if(block.type=="image" )
            {
              if (block.data.file.image) {
                formdata.append("images",block.data.file.image)
                images.push(block.data.file.image)
                
              } else {
                existingimages.push({
                  url:block.data.file.url,
                  imageid:block.data.file.imageid

                })
                
              }
                
                 

            }
        })
        formdata.append("existingimages",JSON.stringify(existingimages))
            try {
        const res=await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/blogs/${id}`,
            formdata,
         {headers:
            {"Content-Type":"multipart/form-data",
             Authorization:`Bearer ${token}`
            }})
            console.log(res.data.message)
            console.log("blogdata",blogData)        //   URL.createObjectURL(blogData.image)
        toast.success(res.data.message)
        navigate('/')
        
    } catch (error) {
        toast.error(error?.response?.data?.message || error.message )
        console.log(error?.response?.data?.message || error.message)
    }
  }

   function initilizeditorjs() {
     if(editorref.current) return

    editorref.current = new EditorJS({
        holder:"editor",
        placeholder:"write something...",

        data: id && content
            ? content
            : { blocks: [] },

        tools: {
            header: {
                class: Header,
                inlineToolbar: true,
                config: {
                    placeholder: 'Enter a header',
                    levels: [2,3,4],
                    defaultLevel:3
                }
            },

            list: {
                class: EditorjsList,
                inlineToolbar: true,
                config: {
                    defaultStyle: 'unordered'
                }
            },

            code: CodeTool,

            marker: {
                class: Marker,
                shortcut: 'CMD+SHIFT+M',
            },

            underline: Underline,
            embed: Embed,
            raw: RawTool,
            textVariant: TextVariantTune,

            image: {
                class: ImageTool,
                config: {
                    uploader:{
                        uploadByFile: async(image)=>{
                            return {
                                success:1,
                                file:{
                                    url: URL.createObjectURL(image),
                                    image
                                }
                            }
                        }
                    }
                }
            }
        },

        tunes:['textVariant'],

        onChange: async ()=>{

            const data = await editorref.current.save()

            setblogdata(prev => ({
                ...prev,
                content:data
            }))
        }
    })
}


  useEffect(() => {

    const timer = setTimeout(() => {

        if(!editorref.current)
        {
            initilizeditorjs()
        }

    }, 0)

    return () => {

        clearTimeout(timer)

        if(
            editorref.current &&
            typeof editorref.current.destroy === "function"
        )
        {
            editorref.current.destroy()
            editorref.current = null
        }
    }

}, [])
    
        
    
    
   
    // // useEffect(()=>{
    // //     if(!token)
    // //     {
    // //         return navigate("/signin")
    // //     }
    // // })

  return token == null ? 
  (<Navigate to={"/signin"}/>):
  (
  <div className='max-w-[700px] mt-20 flex flex-col gap-8 mx-auto'>

 
  <div className='flex items-center gap-5'>
    <label className='font-extrabold w-[120px]'>
      Title :
    </label>

    <input
      className='border-2 border-black p-2 rounded-md flex-1'
      type="text"
      placeholder='title'
      onChange={(e) =>
        setblogdata((blogData) => ({
          ...blogData,
          title: e.target.value
        }))
      }
      value={blogData.title}
    />
  </div>

  <div className='flex items-start gap-5'>
    <label className='font-extrabold w-[120px] pt-2'>
      Description :
    </label>

    <textarea
      className='border-2 border-black p-2 rounded-md flex-1 min-h-[120px]'
      placeholder='description'
      onChange={(e) =>
        setblogdata((blogData) => ({
          ...blogData,
          description: e.target.value
        }))
      }
      value={blogData.description}
    />
  </div>

  
  <div className='flex items-center gap-5'>
    <label className='font-extrabold w-[120px]'>
      Main Image :
    </label>

    <label htmlFor="image" className='cursor-pointer flex-1'>
      {
        blogData.image ? (
          <img
            className='rounded-md max-h-[250px] object-cover'
            src={
              typeof(blogData.image) === "string"
                ? blogData.image
                : URL.createObjectURL(blogData.image)
            }
            alt=""
          />
        ) : (
          <div className='bg-slate-500 aspect-video flex justify-center items-center text-2xl text-white rounded-md'>
            Select Image
          </div>
        )
      }
    </label>

    <input
      className='hidden'
      id='image'
      type="file"
      accept='.png, .jpg, .jpeg'
      onChange={(e) =>
        setblogdata((blogData) => ({
          ...blogData,
          image: e.target.files[0]
        }))
      }
    />
  </div>

  <div className='flex items-start gap-5'>
  
  <label className='font-extrabold w-[120px] pt-2'>
    Content :
  </label>

  <div
    id="editor"
    className='border rounded-md p-4 flex-1 min-h-[250px]'
  ></div>

</div>
  

  
  <button
    className='font-extrabold bg-red-500 text-white p-3 rounded-md w-[200px] mx-auto'
    onClick={id ? handleupdateblog : handlepostblog}
  >
    {id ? "Edit blog" : "Post blog"}
  </button>

</div>
  ) 
  
}

export default Addblog