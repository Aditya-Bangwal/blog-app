import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setisOpen } from '../utils/commentSlice'
import axios from 'axios'
import toast from 'react-hot-toast'
import { deletecommentandreply, setcommentlikes, setcomments, setreplies, setUpdatedcomment } from '../utils/selectedblogslice'
import {formatdate} from "../utils/formatdate"

function Comment() {
    const [activereply,setactivereply]=useState(null)
    const[currentpopup,setcurrentpopup]=useState(null)
    const[currenteditcomment,setcurrenteditcomment]=useState(null)
    
   
    const dispatch=useDispatch()
    const [comment,setcomment]=useState("")
    
    const {_id:blogId,comments,creator:{_id:creatorId}}=useSelector((state)=>state.selectedBlogSlice)
    const {token,id:userId}=useSelector((state)=>state.user)

    async function handlecomment() {
        try {
            let res=await axios.post(`${import.meta.env.VITE_BACKEND_URL}/blogs/comment/${blogId}`,
            {
                comment
            },
              {
                headers:{
                     Authorization: `Bearer ${token}`,

                }
            })
            
            toast.success(res.data.message)
            dispatch(setcomments(res.data.newcomment))
            setcomment("")
            setcomment("")
            
        } catch (error) {
           
            toast.error(error?.response?.data?.message || error.message)
            
        }
        
    }

  

  return (
    <div className='bg-white border-l drop-shadow-xl h-screen fixed top-0 right-0 w-[400px] overflow-y-scroll p-9'>
        <div className='flex justify-between p-5'>
            <h1 className='text-xl font-medium'>Comment ({comments.length})</h1>
            <i onClick={()=>dispatch(setisOpen(false))} className="fi fi-br-cross text-xl cursor-pointer"></i>
        </div>

        <div className='my-2 mx-3'>
            <textarea value={comment}  onChange={(e)=> setcomment(e.target.value)} type="text" placeholder='Comment...' className='drop-shadow-xl border h-14 resize-none text-lg w-full p-4 focus:outline-none' />
            <button onClick={handlecomment} className='bg-green-500 px-7 py-3 rounded-2xl mt-3 font-bold text-white'>Add</button>
        </div>

        <div className='my-2 mx-3 mt-4'>
           <Displaycomment comments={comments} userId={userId} blogId={blogId} token={token}  
           activereply={activereply} setactivereply={setactivereply} currentpopup={currentpopup} 
           setcurrentpopup={setcurrentpopup} currenteditcomment={currenteditcomment} setcurrenteditcomment={setcurrenteditcomment}
           creatorId={creatorId}
           />

        </div>

        
    </div>
  )
}

function Displaycomment({comments,userId,blogId,token,activereply,setactivereply,currentpopup,setcurrentpopup,currenteditcomment,setcurrenteditcomment,creatorId})
{
     const[reply,setreply]=useState()
     const dispatch=useDispatch()
     const[updcomment,setupdcomment]=useState("")
   
     
    
        async function handlereply(parentcommentid) {
        try {
            let res=await axios.post(`${import.meta.env.VITE_BACKEND_URL}/blogs/comment/${parentcommentid}/${blogId}`,
            {
                reply
            },
              {
                headers:{
                     Authorization: `Bearer ${token}`,

                }
            })
            
            toast.success(res.data.message)
            setreply("")
             setactivereply(null)
             dispatch(setreplies(res.data.newreply))
             
            
        } catch (error) {
          
            toast.error(error?.response?.data?.message+"its not working" || error.message+"its not working")
            
        }
        
    }
    async function handlecommentlike(commentid)
    {
       
        try {
            let res=await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/blogs/comment/like/${commentid}`,
                   {},
              {
                headers:{
                     Authorization: `Bearer ${token}`,

                }
            }
           
            )
            
             toast.success(res.data.message)
              dispatch(setcommentlikes({commentid,userId}))

            
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message)
            
        }

    }

    async function handleactivereply(id)
    {
        setactivereply((prev)=>(prev==id ? null : id))

    }
    async function handleupdatecomment(id)
    {
         try {
            let res=await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/blogs/comment/${id}`,
                   {updcomment},
              {
                headers:{
                     Authorization: `Bearer ${token}`,

                }
            }
           
            )
             
             setupdcomment("")
             dispatch(setUpdatedcomment(res.data.updatedcomment))
             toast.success(res.data.message)
              
            
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message)
            
        }
        finally
        {
           setupdcomment("")
           setcurrenteditcomment(null)

        }

    }

     async function handledeletecomment(id)
    {
         try {
            let res=await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/blogs/comment/${id}`,
                   
              {
                headers:{
                     Authorization: `Bearer ${token}`,

                }
            }
           
            )
            // console.log(res)
            //  setupdcomment("")
             dispatch(deletecommentandreply(id))
             toast.success(res.data.message)
              
            
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message)
            
        }
        finally
        {
           setupdcomment("")
           setcurrenteditcomment(null)

        }

    }



    return (
      <>
        {" "}
        {comments?.map((com) => (
          <div key={com?._id} className="mt-5">
            {currenteditcomment == com._id ? (
              <div className="my-3 mx-2 bg-gray-50 border rounded-xl p-4 shadow-sm">
                <textarea
                  defaultValue={com.comment}
                  onChange={(e) => setupdcomment(e.target.value)}
                  placeholder="Write a reply..."
                  className="w-full min-h-[90px] resize-none rounded-lg border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                />

                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => handleupdatecomment(com._id)}
                    className="bg-green-500 hover:bg-green-600 transition px-5 py-2 rounded-lg font-semibold text-white"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => {
                      setcurrenteditcomment(null);
                    }}
                    className="bg-gray-300 hover:bg-gray-400 transition px-5 py-2 rounded-lg font-semibold text-black"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white border rounded-2xl p-4 shadow-sm mb-4">
                {/* Top Section */}
                <div className="flex justify-between items-start">
                  {/* User Info */}
                  <div className="flex gap-3">
                    <img
                      className="w-11 h-11 rounded-full object-cover border"
                      src={`https://api.dicebear.com/9.x/initials/svg?seed=${com?.user?.name}`}
                      alt=""
                    />

                    <div className="flex flex-col">
                      <p className="font-semibold text-lg leading-none">
                        {com?.user?.name}
                      </p>

                      <p className="text-gray-500 text-xs mt-1">
                        {formatdate(com?.createdAt?.split("T")[0])}
                      </p>
                    </div>
                  </div>

                  {/* Popup */}
                  {(com.user._id == userId || userId == creatorId) &&
                    (currentpopup == com._id ? (
                      <div className="bg-white border rounded-lg shadow-md p-2 flex flex-col gap-2 items-center">
                        <i
                          onClick={() => setcurrentpopup(null)}
                          className="fi fi-br-cross cursor-pointer text-sm"
                        ></i>

                        {com.user._id == userId && (
                          <button
                            onClick={() => {
                              setcurrenteditcomment(com._id);
                            }}
                            className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded-md w-full"
                          >
                            Edit
                          </button>
                        )}

                        <button
                          onClick={() => {
                            handledeletecomment(com._id);
                            // setcurrenteditcomment(com._id)
                          }}
                          className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded-md w-full"
                        >
                          Delete
                        </button>
                      </div>
                    ) : (
                      <i
                        onClick={() => setcurrentpopup(com._id)}
                        className="fi fi-tr-square-ellipsis cursor-pointer text-lg text-gray-600"
                      ></i>
                    ))}
                </div>

                {/* Comment */}
                <p className="text-gray-700 text-[15px] leading-relaxed mt-4 break-words">
                  {com?.comment}
                </p>

                {/* Bottom Actions */}
                <div className="flex justify-between items-center mt-4">
                  {/* Likes + Replies */}
                  <div className="flex items-center gap-5">
                    {/* Likes */}
                    <div className="flex items-center gap-2">
                      {com?.likes?.includes(userId) ? (
                        <i
                          onClick={() => handlecommentlike(com?._id)}
                          className="fi fi-sr-thumbs-up text-red-500 text-lg cursor-pointer"
                        ></i>
                      ) : (
                        <i
                          onClick={() => handlecommentlike(com._id)}
                          className="fi fi-rr-social-network text-lg cursor-pointer"
                        ></i>
                      )}

                      <p className="text-sm font-medium">
                        {com?.likes?.length}
                      </p>
                    </div>

                    {/* Replies */}
                    <div className="flex items-center gap-2">
                      <i className="fi fi-sr-comment-alt text-lg"></i>

                      <p className="text-sm font-medium">
                        {com?.replies?.length}
                      </p>
                    </div>
                  </div>

                  {/* Reply Button */}
                  <button
                    onClick={() => handleactivereply(com._id)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Reply
                  </button>
                </div>
              </div>
            )}

            <div>
              {activereply == com._id && (
                <div className="my-2 mx-3">
                  <textarea
                    onChange={(e) => setreply(e.target.value)}
                    type="text"
                    placeholder="Comment..."
                    className="drop-shadow-xl border h-14 overflow-hidden resize-none text-lg w-full p-4 focus:outline-none"
                  />
                  <button
                    onClick={() => handlereply(com._id)}
                    className="bg-green-500 px-7 py-3 rounded-2xl mt-3 font-bold text-white"
                  >
                    Add
                  </button>
                </div>
              )}
              {com?.replies?.length > 0 && (
                <div className="ml-4 pl-4 border border-gray-200">
                  <Displaycomment
                    comments={com.replies}
                    userId={userId}
                    blogId={blogId}
                    token={token}
                    activereply={activereply}
                    setactivereply={setactivereply}
                    currentpopup={currentpopup}
                    setcurrentpopup={setcurrentpopup}
                    currenteditcomment={currenteditcomment}
                    setcurrenteditcomment={setcurrenteditcomment}
                    creatorId={creatorId}
                  />
                </div>
              )}
            </div>

            <hr className="text-gray-500" />
          </div>
        ))}
      </>
    );

}

export default Comment