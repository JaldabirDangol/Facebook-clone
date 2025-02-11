import React from 'react'
import LeftSideBar from './LeftSideBar'
import RightSideBar from './RightSideBar'
import { Navbar } from './Navbar'

const Home = () => {
  return (
    <div className='w-screen h-screen'>
      <Navbar/>
      <div className='flex justify-between'>
        <LeftSideBar />
           
            <RightSideBar />
            
      </div>

    </div>
  )
}

export default Home