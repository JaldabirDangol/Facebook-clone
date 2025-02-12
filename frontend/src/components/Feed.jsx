import useGetPost from '@/hooks/useGetPost'
import React from 'react'
import { useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { SlOptions } from "react-icons/sl";
import { RxCross1 } from "react-icons/rx";
import CreatePost from './CreatePost';


const Feed = () => {
  useGetPost();
  const {posts} = useSelector(store => store.post)
  console.log(posts)
  return (
   <div className='w-1/2'>
         <CreatePost/>
    feed
       {
        posts.map((post)=>{
          <div className='flex flex-col mt-4 h-[70%]'>
            <div className='flex justify-between'>
                <div className='flex justify-start gap-4'>
                
                <Avatar>
                  <AvatarImage src={post?.author.profilePicture}/>
                  <AvatarFallback>
                    CN
                  </AvatarFallback>
                </Avatar>
                <h3 className='font-semibold'>{post?.author.usernamme}</h3>
                </div>

                <div className='flex'>
                <SlOptions />
                <RxCross1 />
                </div>
            </div>
              {
                post.image && (
                   <img src={post.image} alt="postimage" />
                )
              }
          </div>
        })
       }
   </div>
  )
}

export default Feed