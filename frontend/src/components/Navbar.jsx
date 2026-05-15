import React, { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import logo from '../assets/logo.svg'
import { useSelector } from 'react-redux'

function Navbar() {
  const {token,name}=useSelector((state)=>state.user)
    
  return (
    <div>
 <div className='bg-white  border-b-slate-500 drop-shadow-sm max-w-full h-[57px] px-[30px] flex justify-between items-center '>
  <div className='flex gap-4 items-center'>
    <Link to={"/"}>
    <div className=''>
      <img className='w-9 m-1' src={logo} alt="" />
    </div>
    </Link>
    <div className='relative'>
      
      <i className="fi fi-rr-search absolute text-lg top-1/2 -translate-y-1/2 ml-4 opacity-50"></i>
      
      <input type="text" className='bg-gray-100 rounded-2xl p-1 text-lg pl-10 focus:outline-none ' placeholder='Search' />
    </div>
    
    
  </div>
  <div className='flex gap-5 justify-center items-center'>
    <Link to={"/addblog"}>
    <div className='flex gap-2'>
      <i className="fi fi-rr-edit text-2xl mt-1 text-gray-500 "></i>
      <span className='text-xl text-gray-500 '>write</span>
    </div>
    </Link>
    
    {
      token? <div className='text-xl font-bold pb-2 capitalize'>{name}</div> :
       <div className='flex gap-3'>
      <Link to={"/signin"}>
         <button className='bg-blue-600 px-3 py-1 font-bold rounded-2xl text-white'>Signup</button>
      </Link>
      <Link to={"/signup"}>
      <button className='border py-1 px-3 rounded-2xl font-bold'>Signin</button>
      </Link>
      </div>

    }
   
  </div>
 
 </div>
 <Outlet/>
  </div>
  )
}

export default Navbar