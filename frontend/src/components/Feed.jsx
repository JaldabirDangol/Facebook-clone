import React from 'react'
import { useSelector } from 'react-redux';
import CreatePost from './CreatePost';
import Post from './Post';


const Feed = () => {
  const { posts } = useSelector(store => store.post)
  return (
   <div className='w-full  '>
        <CreatePost/>
    <div>
      {posts.length > 0 ? (
        posts.map((post) => <Post key={post?._id} post={post} />)
      ) : (
        <p>No posts available</p>
      )}
    </div>

       </div>
  )
}

export default Feed