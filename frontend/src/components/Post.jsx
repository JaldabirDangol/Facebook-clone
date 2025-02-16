import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react'
import { IoBookmarkOutline } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaThumbsUp, FaRegComment, FaShare, FaHeart, FaLaughSquint, FaSadTear, FaAngry, FaSurprise } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import axios from 'axios'
import { Card } from './ui/card'
import { backendurl } from '../../configurl'
import { setAllpost, setSelectedPost } from '../../store/postSlice'
import CommentDialog from './CommentDialog'
import { useNavigate } from 'react-router-dom';
import ShareDialog from './ShareDialog';

const reactions = [
    { name: 'like', icon: <FaThumbsUp className="text-blue-500 h-5 w-5" /> },
    { name: 'love', icon: <FaHeart className="text-red-500 h-5 w-5" /> },
    { name: 'haha', icon: <FaLaughSquint className="text-yellow-500 h-5 w-5" /> },
    { name: 'wow', icon: <FaSurprise className="text-yellow-500 h-5 w-5" /> },
    { name: 'sad', icon: <FaSadTear className="text-yellow-500 h-5 w-5" /> },
    { name: 'angry', icon: <FaAngry className="text-red-500 h-5 w-5" /> }
];
const Post = ({ post }) => {
    const [open, setOpen] = useState(false);
    const [openShare , setOpenShare] = useState(false)
    const { user } = useSelector(store => store.auth);
    const { posts ,  selectedpost } = useSelector(store => store.post);
    const [postReactCount, setPostReactCount] = useState(post?.reaction && post?.reaction?.length);
    const [selectedReaction, setSelectedReaction] = useState(null);  
    const [threeDot, setThreeDot] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate(); 

    const toggleReactionHandler = async (reactionType) => {
        try {
            const existingReaction = post.reaction.find(r => r.author === user._id);
            const res = await axios.post(
                `${backendurl}/api/v1/post/${post._id}/reaction`,
                { Rtype: reactionType.name },
                { withCredentials: true }
            );
           
            if (res.data.success) {
                setSelectedReaction(
                    existingReaction && existingReaction.reaction === reactionType.name
                        ? null
                        : reactionType
                );
                // Adjust reaction count
                if (existingReaction && existingReaction.reaction === reactionType.name) {
                    setPostReactCount(postReactCount - 1);
                } else if (!existingReaction) {
                    setPostReactCount(postReactCount + 1);
                }

                dispatch(setAllpost(posts.map(p => p._id === post._id ? {
                    ...p,
                    reaction: existingReaction && existingReaction.reaction === reactionType.name
                        ? p.reaction.filter(r => r.author !== user._id)
                        : [...p.reaction, { author: user._id, reaction: reactionType.name }]
                } : p)));

                toast.success(res.data.message);
            }
        } catch (error) {
            console.error("Reaction Error:", error.response?.data?.message || error.message);
            toast.error(error?.response?.data?.message );
        }
    };
 
    const deletePostHandler = async () => {
        try {
            const res = await axios.delete(`${backendurl}/api/v1/post/delete/${selectedpost._id}`, { withCredentials: true })
            if (res.data.success) {
                const updatedPostData = posts.filter((postItem) => postItem?._id !== post?._id);
                dispatch(setAllpost(updatedPostData));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.messsage);
        }
    }
    const bookmarkHandler = async () => {
        try {
            const res = await axios.get(`${backendurl}/api/v1/post/${selectedpost._id}/savepost`, { withCredentials: true });
            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)
        }
    }
 if (!post?.issharedpost) {
        return (
            <Card className="my-10 max-w-2xl  w-2/3 relative max-h-xl  mx-auto border shadow-sm rounded-lg overflow-hidden">
                {/* Post Header */}
                <div className="flex items-center justify-between pt-3 pl-3 pr-3 ">
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={post?.author?.profilePicture} alt="profile_image" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <h1 className="font-semibold flex items-center gap-1">
                                {post?.author?.username}
                            </h1>
                        </div>
                    </div>
                    <MoreHorizontal onClick={()=>{setThreeDot(!threeDot)
                dispatch(setSelectedPost(post));
            }}  className='cursor-pointer'/>

                </div>
                {
                threeDot   && (
                    <div className='absolute flex flex-col right-2 items-center ml-4
                     top-14 bg-white shadow-md  w-2/3  border rounded-md z-20 gap-2 my-2 cursor-pointer'>
                        <h2 className='mt-2'>Post Options</h2>
                         {  post.author._id === user._id &&
                             <h2 onClick={deletePostHandler}
                             className='flex items-center mr-1'><RiDeleteBin6Line  className='mr-1'/>Delete Post</h2>
                             
                         }
                          <h2 onClick={bookmarkHandler} className='flex  items-center '> <IoBookmarkOutline className='mr-1' />Saved Post</h2>
                          
                          <h2 className='mb-2 flex items-center ' 
                          onClick={()=>navigate(`/profile/${post.author._id}`)}>
                           <Avatar className="mr-2 h-4 w-4">
                            <AvatarImage  src={post.author.profilePicture}/>
                            <AvatarFallback>
                                C
                            </AvatarFallback>
                            </Avatar> View Profile</h2>
                    </div>
                )
            }
                {post?.caption && <p className="p-3 text-sm text-gray-800">{post.caption}</p>}
                {post?.image && <img className="w-full border max-h-[650px] object-cover" src={post.image} alt="post_img"  onError={(e) => e.target.style.display = 'none'}/>}

                {/* Engagement Counts */}
                <div className="flex justify-between items-center text-gray-600 text-sm mt-1 mb-1 px-2">
                    <div className="flex items-center gap-1">
                        {selectedReaction ? selectedReaction.icon : <FaThumbsUp className="text-blue-500" />}
                        <span>{postReactCount}</span>
                    </div>
                    <div>
                        <span onClick={() => {
                            dispatch(setSelectedPost(post));
                            setOpen(true);
                        }} className='cursor-pointer text-sm '>{post?.comment?.length} comments</span> • <span>682 shares</span>
                    </div>
                </div>


                {/* Engagement Bar */}
                <div className="flex items-center justify-center text-gray-600 text-sm font-medium border h-10">
                    {/* Like Button with Reaction Popup on Hover */}
                    <div className="relative flex flex-col justify-center items-center w-1/3 h-full cursor-pointer border-r hover:bg-gray-100 group">
                        <div className="flex items-center gap-2">
                            <FaThumbsUp />
                            <span>{selectedReaction ? selectedReaction.name : 'Like'}</span>
                        </div>
                        {/* Reaction Popup */}
                        <div
                            className="absolute top-[-48px] transform translate-x-[23%] flex bg-white shadow-md rounded-full px-4 py-2 space-x-3 border opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                            {reactions.map((reaction) => (
                                <div
                                    key={reaction.name}
                                    className="cursor-pointer p-2 transition-all hover:scale-125 h-full w-full"
                                    onClick={() => toggleReactionHandler(reaction)}
                                >
                                    {reaction.icon}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Comment Button */}
                    <div onClick={() => {setOpen(true) 
                        dispatch(setSelectedPost(post))
                    }} className="flex justify-center items-center gap-2 cursor-pointer w-1/3 h-full border-r hover:bg-gray-100">
                        <FaRegComment />
                        <span>Comment</span>
                    </div>

                    {/* Share Button */}
                <div onClick={()=>{setOpenShare(true) 
                    dispatch(setSelectedPost(post))
                }} className="flex items-center justify-center gap-2 cursor-pointer w-1/3 h-full hover:bg-gray-100">
                        <FaShare />
                        <span>Share</span>
                    </div>
                </div>
                <ShareDialog openShare={openShare} setOpenShare={setOpenShare}/>
                <CommentDialog open={open} setOpen={setOpen} />
            </Card>
        );
    }
    else {
    return (
        post?.issharedpost && 
        <Card className="my-10  relative max-w-2xl  w-2/3 mx-auto border shadow-sm rounded-lg overflow-hidden">
            {/* Post Header */}
            <div className="flex items-center justify-between pt-3 pl-3 pr-3">
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src={post.author?.profilePicture} alt="profile_image" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <h1 className="font-semibold flex items-center gap-1">
                            {post.author?.username}
                        </h1>
                        <span className="text-gray-500 text-sm">{post.time}</span>
                    </div>
                </div>
            <MoreHorizontal onClick={()=>{setThreeDot(!threeDot)
                dispatch(setSelectedPost(post));
            }}  className='cursor-pointer'/>
            </div>
            {
                threeDot   && (
                    <div className='absolute flex flex-col right-2 items-center ml-4
                     top-14 bg-white shadow-md  w-2/3  border rounded-md z-20 gap-2 my-2 cursor-pointer'>
                        <h2 className='mt-2'>Post Options</h2>
                        {  post.author._id === user._id &&
                             <h2 onClick={deletePostHandler}
                             className='flex items-center mr-1'><RiDeleteBin6Line  className='mr-1'/>Delete Post</h2>
                             
                         }
                          <h2 onClick={bookmarkHandler} className='flex  items-center '> <IoBookmarkOutline className='mr-1' />Saved Post</h2>
                        
                          <h2 className='mb-2 flex items-center ' 
                          onClick={()=>navigate(`/profile/${post.author._id}`)}>
                           <Avatar className="mr-2 h-4 w-4">
                            <AvatarImage  src={post.author.profilePicture}/>
                            <AvatarFallback>
                                C
                            </AvatarFallback>
                            </Avatar> View Profile</h2>
                    </div>
                )
            }

            {post.caption && <p className="p-3 text-sm text-gray-800">{post.caption}</p>}
            <div className='border rounded-xl m-3'>
                {post.issharedpost.image && <img className="w-full rounded-t-xl border max-h-[700px] object-cover" src={post.issharedpost.image} alt="post_img" />}
                {post?.issharedpost?.author?.username && <div className="flex items-center gap-3 mt-2 ml-2">
                    <Avatar>
                        <AvatarImage src={post.issharedpost.author?.profilePicture} alt="profile_image" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <h1 className="font-semibold flex items-center gap-1">
                            {post.issharedpost.author?.username}
                        </h1>
                    </div>

                </div>}{post.issharedpost.caption &&<p className="p-2 text-sm text-gray-800">{post.issharedpost.caption}</p>}
            </div>


            {/* Engagement Counts */}
            <div className="flex justify-between items-center text-gray-600 text-sm mt-1 mb-1 px-2">
                <div className="flex items-center gap-1">
                    {selectedReaction ? selectedReaction.icon : <FaThumbsUp className="text-blue-500" />}
                    <span>{postReactCount}</span>
                </div>
                <div>
                    <span onClick={() => {
                        dispatch(setSelectedPost(post));
                        setOpen(true);
                    }} className='cursor-pointer text-sm '>{post?.comment?.length} comments</span> • <span>682 shares</span>
                </div>
            </div>


            {/* Engagement Bar */}
            <div className="flex items-center justify-center text-gray-600 text-sm font-medium border h-10">
                {/* Like Button with Reaction Popup on Hover */}
                <div className="relative flex flex-col justify-center items-center w-1/3 h-full cursor-pointer border-r hover:bg-gray-100 group">
                    <div className="flex items-center gap-2">
                        <FaThumbsUp />
                        <span>{selectedReaction ? selectedReaction.name : 'Like'}</span>
                    </div>
                    {/* Reaction Popup */}
                    <div
                        className="absolute top-[-48px] transform translate-x-[23%] flex bg-white shadow-md rounded-full px-4 py-2 space-x-3 border opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                        {reactions.map((reaction) => (
                            <div
                                key={reaction.name}
                                className="cursor-pointer p-2 transition-all hover:scale-125 h-full w-full"
                                onClick={() => toggleReactionHandler(reaction)}
                            >
                                {reaction.icon}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Comment Button */}
                <div onClick={() => setOpen(true)} className="flex justify-center items-center gap-2 cursor-pointer w-1/3 h-full border-r hover:bg-gray-100">
                    <FaRegComment />
                    <span>Comment</span>
                </div>

                {/* Share Button */}
                <div onClick={()=>{setOpenShare(true) 
                    dispatch(setSelectedPost(post))
                }} className="flex items-center justify-center gap-2 cursor-pointer w-1/3 h-full hover:bg-gray-100">
                        <FaShare />
                        <span>Share</span>
                    </div>
                </div>
                <ShareDialog openShare={openShare} setOpenShare={setOpenShare}/>
            <CommentDialog open={open} setOpen={setOpen} />
        </Card>

        );
    };
}
export default Post