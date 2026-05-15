import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Authform from './pages/Authform'
import Navbar from './components/Navbar'
import Homepage from './components/Homepage'
import Addblog from './pages/Addblog'
import Blogpage from './pages/Blogpage'
import Verifyuser from './components/Verifyuser'

function App() {
  

  return (
    <div className=' w-screen min-h-screen  '>
    <Routes className=''>
      <Route path='/' element={<Navbar/>}>
      <Route path="/" element={<Homepage/>}></Route>
      <Route path="/signin" element={<Authform type={"signin"}/>}></Route>
      <Route path="/signup" element={<Authform type={"signup"}/>}></Route>
      <Route path="/addblog" element={<Addblog/>}></Route>
      <Route path="/blog/:id" element={<Blogpage/>}></Route>
      <Route path="/edit/:id" element={<Addblog/>}></Route>
       <Route path="/verify-email/:verificationtoken" element={<Verifyuser/>}></Route>
      </Route>
    </Routes>
    </div>
  )
}

export default App
