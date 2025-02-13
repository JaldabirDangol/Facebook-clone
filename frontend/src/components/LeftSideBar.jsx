import React from "react";
import { Navbar } from "./Navbar";
import { FaUserFriends } from "react-icons/fa";
import {LogOut } from 'lucide-react'
import { RiMemoriesFill } from "react-icons/ri";
import { IoMdBookmark } from "react-icons/io";
import { MdGroups2 } from "react-icons/md";
import { CiShop } from "react-icons/ci";
import { FaFacebookMessenger } from "react-icons/fa";
import { BsCameraReels } from "react-icons/bs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useNavigate } from "react-router-dom";
import { backendurl } from "../../configurl";
import { toast } from "sonner";
import axios from "axios";
import { useSelector } from "react-redux";
const LeftSideBar = () => {
    const navigate = useNavigate(); 
    const {user} = useSelector(store => store.auth)
  const sidebarItems = [
    {
      icon: (
        <Avatar className="w-7 h-7">
          <AvatarImage src={user?.profilePicture} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon : <FaUserFriends size={32} color="#1877F2"/> ,text:'Findfriends'},
    { icon: <RiMemoriesFill  size={32} color="#3274ca"/> , text:'Memories'},
    { icon: <IoMdBookmark  size={32} color="#9021eb"/> , text:'Saved' },
    { icon: <MdGroups2 size={32} color="#2560ad"/> , text:'Groups' },
    { icon: <CiShop size={32} color="#1619c2" /> , text:'Marketplace'},
    { icon: <FaFacebookMessenger size={32} color="#1877F2"/>  , text:'Messenger'},
    { icon: <BsCameraReels size={32} color="#be9e0c" /> , text:'Reels'},
    { icon: <LogOut size={32} color="#4e2828"/>, text: "Logout" },
  ];
  const sidebarHandler = (text) => {
    switch (text) {
        case "Profile":
            navigate(`/profile/${user._id}`);
            break;
        case "Findfriends":
            navigate('/friends');
            break;
        case "Saved":
            navigate('/saved');
            break;
        case "Groups":
            navigate('/groups');
            break;
        case "Marketplace":
            navigate('/marketplace');
            break;
        case "Messenger":
            navigate('/chat');
            break;
        case "Reels":
            navigate('/reels');
            break;
        case "Logout" :
            logOutHandler();
            break;
        default:
            console.log("Invalid option");
    }
};
const logOutHandler = async () => {
    try {
      const res = await axios.get(`${backendurl}/api/v1/user/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        // dispatch(setAuthUser(null));
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    }
  };
  return (
    <div className="bg-gray-100 w-[25%]  sticky left-0 flex flex-col z-40 top-18  max-h-screen
     overflow-y-auto ">
      {
        sidebarItems.map((item,index)=>{
            return(
                <div onClick={() => sidebarHandler(item.text)} key={index}
                className="flex items-center gap-3 ml-2 mt-2 relative
                 hover:bg-gray-100 cursor-pointer rounded-lg p-3">
              {item.icon}
                <span>{item.text}</span>
                </div>
            )
        })
      }
      <hr className="border-b mt-2 bg-slate-400"/>
      <div className="text-slate-600 font-semibold ml-4 mt-4">
        Your Shortcuts
      </div>
    </div>
  );
};

export default LeftSideBar;
