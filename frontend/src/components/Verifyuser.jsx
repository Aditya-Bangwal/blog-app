import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'

function Verifyuser() {
    const {verificationtoken}=useParams()
    const navigate=useNavigate()
    useEffect(()=>{
       async function verifyuser()
       {
        try {
                const res=await axios.get(`${import.meta.env.VITE_BACKEND_URL}/verify-email/${verificationtoken}`,
            {
               
            },
              {
                
            })
            
            toast.success(res.data.message)
            navigate("/signin")
            
        } catch (error) {
            toast.error(error)
            
        }
        finally{
            navigate("/signin")
        }
     

       }
       verifyuser()
    },[verificationtoken])   
  return (
    <div>Verifyuser</div>
  )
}

export default Verifyuser