import React from 'react'
import Feed from './Feed'
import useGetPost from '@/hooks/useGetPost'

const Home = () => {
  useGetPost()
  return (
    <div className='flex-grow overflow-auto mb-16 bg-gray-50'>
      <Feed/>
    </div>
  )
}

export default Home
