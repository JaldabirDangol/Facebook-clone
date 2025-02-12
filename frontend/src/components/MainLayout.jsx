import React from 'react'
import { Navbar } from './Navbar'
import { Outlet } from 'react-router-dom'
import LeftSideBar from './LeftSideBar'
import RightSideBar from './RightSideBar'

const MainLayout = () => {
  return (
    <div className='w-screen h-screen'>
        <Navbar/>
        <div className='flex justify-between'>
            <LeftSideBar/>
            <Outlet/>
            <RightSideBar/>
        </div>
    </div>
  )
}

export default MainLayout