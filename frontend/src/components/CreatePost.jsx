import { Video, Image, Smile } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import React, { useState } from 'react'
import { useSelector } from "react-redux";
import CreatePostDialog from "./CreatePostDialog";

const CreatePost = () => {
  const { user } = useSelector(store => store.auth);
  const [open, setOpen] = useState(false)

  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-full md:w-2/3 mx-auto mt-1 ">
      {/* Top Section: Avatar & Input */}
      <div className="flex items-center space-x-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src={user?.profilePicture} />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <input
          onClick={() => setOpen(true)}
          type="text"
          placeholder={`What's on your mind ,  ${user?.username}?`}
          className="flex-grow bg-gray-100 rounded-full px-4 py-2 text-sm outline-none"
        />
      </div>

      {/* Divider */}
      <hr className="my-3 border-gray-300" />

      {/* Bottom Section: Post Options */}
      <div className="flex justify-between">
        <button className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-md">
          <Video className="text-red-500" size={20} />
          <span className="text-sm">Live video</span>
        </button>
        <button onClick={() => setOpen(true)} className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-md">
          <Image className="text-green-500" size={20} />
          <span className="text-sm">Photo/video</span>
        </button>
        <button className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-md">
          <Smile className="text-yellow-500" size={20} />
          <span className="text-sm">Feeling/activity</span>
        </button>
      </div>
      <CreatePostDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default CreatePost;