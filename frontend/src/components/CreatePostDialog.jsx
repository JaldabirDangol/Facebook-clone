import React, { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { IoMdPhotos } from "react-icons/io";
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { readFileAsDataURL } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { backendurl } from '../../configurl';
import { setAllpost } from '../../store/postSlice';

const CreatePostDialog = ({ open, setOpen }) => {
    const imageRef = useRef();
    const [file, setFile] = useState(null);
    const [caption, setCaption] = useState('');
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);
    const { posts } = useSelector(store => store.post);
    const [visibility, setVisibility] = useState("public");
    const dispatch = useDispatch();

    const fileChangeHandler = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file);
            const dataUrl = await readFileAsDataURL(file);
            setImagePreview(dataUrl);
        }
    };

    const createPostHandler = async () => {
        const formData = new FormData();
        formData.append('caption', caption);
        if (imagePreview) formData.append('photo', file);
        if (visibility) formData.append('visibility',visibility)
        try {
            setLoading(true);
            const res = await axios.post(`${backendurl}/api/v1/post/addpost`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });
            if (res.data.success) {
                dispatch(setAllpost([res.data.post, ...posts]));
                toast.success(res.data.message);
                setOpen(false);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent onInteractOutside={() => setOpen(false)} className="w-[400px] rounded-lg">
                <DialogHeader className="text-center font-semibold text-lg pb-5 border-b">Create Post</DialogHeader>
                <div className="flex items-center gap-2 p-2">
                    <Avatar>
                        <AvatarImage src={user?.profilePicture} alt="Profile" />
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="font-semibold text-sm">{user?.username}</h1>
                        <span className="text-gray-500 text-xs">Visibility:</span>
                        <select
                            className="text-gray-500 text-xs mx-2 bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none"
                            value={visibility}
                            onChange={(e) => setVisibility(e.target.value)}
                        >
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                            <option value="freinds">Friends</option>
                        </select>
                    </div>
                </div>
                <Textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="focus-visible:ring-transparent border-none -mt-5 mb-7"
                    placeholder="What's on your mind?"
                />
                {imagePreview && (
                    <div className="w-full h-48 mt-2 flex items-center justify-center">
                        <img src={imagePreview} alt="Preview" className="object-cover h-full w-full rounded-md" />
                    </div>
                )}
                <input ref={imageRef} type="file" className="hidden " onChange={fileChangeHandler} />
                <div className="flex gap-4 justify-between items-center p-2 h-[50px] border rounded-lg">
                    <div>Add to Post</div>
                    <button onClick={() => imageRef.current.click()} className="flex items-center gap-2 text-blue-500 ">
                        <span className="p-1 text-2xl rounded-full"><IoMdPhotos/></span>
                    </button>
                </div>
                <Button onClick={createPostHandler} disabled={!caption && !imagePreview} className="w-full bg-blue-500 hover:bg-blue-600 mt-2">
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Post'}
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default CreatePostDialog