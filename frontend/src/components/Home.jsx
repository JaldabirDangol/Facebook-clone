import React from 'react'
import Feed from './Feed'
import useGetPost from '@/hooks/useGetPost'

const Home = () => {
  useGetPost()
  return (
    <Feed/>
  )
}

export default Home
