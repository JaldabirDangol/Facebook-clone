import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react'
import { Button } from './ui/button'
import { FaThumbsUp, FaRegComment, FaShare, FaHeart, FaLaughSquint, FaSadTear, FaAngry, FaSurprise } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import axios from 'axios'
import { Card } from './ui/card'
import { backendurl } from '../../configurl'
import { setAllpost, setSelectedPost } from '../../store/postSlice'
import CommentDialog from './CommentDialog'


const reactions = [
    { name: 'like', icon: <FaThumbsUp className="text-blue-500 h-5 w-5" /> },
    { name: 'love', icon: <FaHeart className="text-red-500 h-5 w-5" /> },
    { name: 'haha', icon: <FaLaughSquint className="text-yellow-500 h-5 w-5" /> },
    { name: 'wow', icon: <FaSurprise className="text-yellow-500 h-5 w-5" /> },
    { name: 'sad', icon: <FaSadTear className="text-yellow-500 h-5 w-5" /> },
    { name: 'angry', icon: <FaAngry className="text-red-500 h-5 w-5" /> }
];



const Post = ({ post }) => {
    const [text, setText] = useState("");
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);
    const { posts } = useSelector(store => store.post);
    const [postReactCount, setPostReactCount] = useState(post.reactions && post?.reactions?.length);
    const [selectedReaction, setSelectedReaction] = useState(null);  // Track selected reaction directly
    const [comment, setComment] = useState(post.comments);
    const dispatch = useDispatch();

    const handleInputChange = (e) => {
        setText(e.target.value.trim() ? e.target.value : "");
    };

    const toggleReactionHandler = async (reactionType) => {
        try {
            // Check if user already reacted
            const existingReaction = post.reactions.find(r => r.author === user._id);

            const res = await axios.post(
                `${backendurl}/api/v1/post/${post._id}/reactions`,
                { reaction: reactionType.name },
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
                    reactions: existingReaction && existingReaction.reaction === reactionType.name
                        ? p.reactions.filter(r => r.author !== user._id)
                        : [...p.reactions, { author: user._id, reaction: reactionType.name }]
                } : p)));

                toast.success(res.data.message);
            }
        } catch (error) {
            console.error("Reaction Error:", error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || "Failed to react");
        }
    };

    const commentHandler = async () => {
        try {
            const res = await axios.post(`${backendurl}/api/v1/post/${post._id}/comment`, { text }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            console.log(res.data);
            if (res.data.success) {
                const updatedCommentData = [...comment, res.data.comment];
                setComment(updatedCommentData);

                const updatedPostData = posts.map(p =>
                    p._id === post._id ? { ...p, comments: updatedCommentData } : p
                );

                dispatch(setAllpost(updatedPostData));
                toast.success(res.data.message);
                setText("");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const deletePostHandler = async () => {
        try {
            const res = await axios.delete(`${backendurl}/api/v1/post/delete/${post?._id}`, { withCredentials: true })
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
            const res = await axios.get(`${backendurl}/api/v1/post/${post?._id}/saved`, { withCredentials: true });
            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    if (!post.originalPost) {
        return (
            <Card className="my-10 w-full max-w-xl mx-auto border shadow-sm rounded-lg overflow-hidden">
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
                    <MoreHorizontal className="cursor-pointer text-gray-600" />
                </div>

                {/* Post Content */}
                {post.caption && <p className="p-3 text-sm text-gray-800">{post.caption}</p>}

                {/* Post Image */}
                {post.image && <img className="w-full border" src={post.image} alt="post_img" />}

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
                        }} className='cursor-pointer text-sm '>{post?.comments?.length} comments</span> • <span>682 shares</span>
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
                    <div className="flex items-center justify-center gap-2 cursor-pointer w-1/3 h-full hover:bg-gray-100">
                        <FaShare />
                        <span>Share</span>
                    </div>
                </div>
                <CommentDialog open={open} setOpen={setOpen} />
            </Card>
        );
    }
    else {
        return (
            <Card className="my-10 w-full max-w-xl mx-auto border shadow-sm rounded-lg overflow-hidden">
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
                    <MoreHorizontal className="cursor-pointer text-gray-600" />
                </div>

                {/* Post Content */}
                {post.caption && <p className="p-3 text-sm text-gray-800">{post.caption}</p>}

                <div className='border rounded-xl m-3'>
                    {post.originalPost.image && <img className="w-full rounded-t-xl border" src={post.originalPost.image} alt="post_img" />}
                    {post.originalPost.author.username && <div className="flex items-center gap-3 mt-2 ml-2">
                        <Avatar>
                            <AvatarImage src={post.originalPost.author?.profilePicture} alt="profile_image" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <h1 className="font-semibold flex items-center gap-1">
                                {post.originalPost.author?.username}
                            </h1>
                        </div>

                    </div>}{post.originalPost.caption &&<p className="p-2 text-sm text-gray-800">{post.originalPost.caption}</p>}
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
                        }} className='cursor-pointer text-sm '>{post?.comments?.length} comments</span> • <span>682 shares</span>
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
                    <div className="flex items-center justify-center gap-2 cursor-pointer w-1/3 h-full hover:bg-gray-100">
                        <FaShare />
                        <span>Share</span>
                    </div>
                </div>
                <CommentDialog open={open} setOpen={setOpen} />
            </Card>
        );
    };
}

export default Post