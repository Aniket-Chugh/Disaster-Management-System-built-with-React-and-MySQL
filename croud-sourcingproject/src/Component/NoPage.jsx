import React from 'react'
import Navbar from './NavBar'
import Footer from './Footer'

const NoPage = () => {
  return (
   <div className='flex flex-col h-screen'>
   <Navbar></Navbar>
   <div className='flex items-center h-full justify-center'>
<div>

   <h1 className='text-5xl font-bold'>No Page Found</h1>
</div>
   </div>
   <Footer></Footer>
   </div>
  )
}

export default NoPage
