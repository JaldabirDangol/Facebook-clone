import React from 'react'
import logo from '../assets/logo.png';
import { MdHome } from "react-icons/md";
import { FaUserFriends } from "react-icons/fa";
import { TbCube } from "react-icons/tb";
import { FaFacebookMessenger } from "react-icons/fa";
import { IoNotifications } from "react-icons/io5";
import { Avatar, AvatarFallback ,AvatarImage} from './ui/avatar';
import { Input } from './ui/input';

export const Navbar = () => {
  return (
    <div className='h-16 w-screen border rounded-lg bg-white flex items-center justify-between'>
        <div className='flex items-center justify-start ml-4 gap-2'>
        <div> <img src={logo} alt="Logo" className="h-16 w-16 object-contain" /></div>
        <Input 
    className="border border-gray-300 rounded-xl bg-gray-100 outline-none focus:outline-none focus:ring-0 focus:border-gray-300 focus:shadow-none"
  placeholder="Search Facebook"
   />


       
        </div>
        <div className='flex items-center justify-center gap-16'>
        <div><MdHome size={24} />  </div>
        <div><FaUserFriends size={24}/> </div>
        <div><FaUserFriends size={24}/>  </div>
        <div><FaUserFriends size={24}/> </div>
        <div><FaUserFriends size={24}/>  </div>
       
        </div>

        <div className='mr-8 flex justify-end gap-4'>
          <div><TbCube size={24} /></div>
         <div><FaFacebookMessenger size={24} /></div>
         <div><IoNotifications size={24}/></div>
         <div>
                  <Avatar className="w-7 h-7">
                    {/* <AvatarImage src={user?.profilepicture} /> */}
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
         </div>
        </div>
    </div>
  )
}
