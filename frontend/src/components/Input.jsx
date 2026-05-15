import React from 'react'
import { useState } from 'react';

function Input({type,placeholder,setuserdata,key2,value,image}) {
    const [showpassword,setshowpassword]=useState(false)
    function handlehidden()
    {
        setshowpassword((prev)=>!prev)


    }
  return ( 
    <div className='w-full relative '>
        <i className={`  fi fi-${image} text-xl left-2 opacity-30 absolute top-[55%] -translate-y-1/2`}></i>
       
      <input
      onChange={(e) =>
          setuserdata((prev) => ({ ...prev, [key2]: e.target.value }))
        }
        value={value}
        type={type!="password"?type: showpassword?"type":"password"}
        placeholder={placeholder}
        className="w-full bg-white h-[50px] rounded-full text-xl p-9 focus:outline-none"
      />
      {
        key2=="password"
        &&
        (<i onClick={handlehidden} className={`fi ${showpassword ? "fi-rr-eye":"fi-rr-eye-crossed"} text-xl right-7 opacity-30 absolute top-[55%] -translate-y-1/2`}></i>

        )}
    </div>
  );
}

export default Input