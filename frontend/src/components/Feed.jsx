import useGetPost from '@/hooks/useGetPost'
import React from 'react'
import { useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { SlOptions } from "react-icons/sl";
import { RxCross1 } from "react-icons/rx";
import CreatePost from './CreatePost';
import Post from './Post';


const Feed = () => {
  useGetPost();
  const { posts } = useSelector(store => store.post)
  return (
   <div className='w-1/2 '>
        <CreatePost/>
      
{posts?.length > 0 &&
  posts.map((post) => (

    <div>
      {posts.length > 0 ? (
        posts.map((post) => <Post key={post._id} post={post} />)
      ) : (
        <p>No posts available</p>
      )}
    </div>
  ))}

       </div>
  )
}

export default Feed