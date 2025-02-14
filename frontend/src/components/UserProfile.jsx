import React from 'react'
import { Navbar } from './Navbar'
import Profile from './Profile'
import { useParams } from 'react-router-dom';
import useGetUserProfile from '@/hooks/useGetUserProfile';

const UserProfile = () => {
  return (
    <div><Navbar/>
    <Profile/>
    </div>
  )
}

export default UserProfile