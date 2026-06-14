import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Authform from './pages/Authform'
import Navbar from './components/Navbar'
import Homepage from './components/Homepage'
import Addblog from './pages/Addblog'
import Blogpage from './pages/Blogpage'
import Verifyuser from './components/Verifyuser'
import Profilepage from './pages/Profilepage'
import Editprofile from './pages/Editprofile'
import Searchblogs from './pages/Searchblogs'

import Setting from './components/Setting'

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
       <Route path="/search" element={<Searchblogs/>}></Route>
       <Route path="/tag/:tag" element={<Searchblogs/>}></Route>
       <Route path="/verify-email/:verificationtoken" element={<Verifyuser/>}></Route>
        <Route path="/:username" element={<Profilepage />}></Route>
        <Route path="/:username/saved-blogs" element={<Profilepage />}></Route>
        <Route path="/:username/liked-blogs" element={<Profilepage />}></Route>
        <Route path="/:username/draft-blogs" element={<Profilepage />}></Route>
        <Route path="/edit-profile" element={<Editprofile/>}></Route>
        <Route path="/setting" element={<Setting/>}></Route>
      </Route>
    </Routes>
    </div>
  )
}

export default App
