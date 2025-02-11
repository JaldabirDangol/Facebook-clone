import React, { useState } from 'react'
import logo from '../assets/logo.png';
import { MdOndemandVideo } from "react-icons/md";
import { MdHome } from "react-icons/md";
import { FaUserFriends } from "react-icons/fa";
import { TbCube } from "react-icons/tb";
import { FaFacebookMessenger } from "react-icons/fa";
import { IoNotifications } from "react-icons/io5";
import { Avatar, AvatarFallback ,AvatarImage} from './ui/avatar';
import { IoGameControllerOutline } from "react-icons/io5";
import { Input } from './ui/input';
import { CiShop } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { backendurl } from '../../configurl';
import { toast } from 'sonner';

export const Navbar = () => {
   const navigate = useNavigate();
   const [searchBox,setSearchBox] = useState('');
   const [searchResults, setSearchResults] = useState([]);

  const navbarHandler = (name)=>{
    if(name === 'home'){
      navigate('/')
    }else if(name === 'friends'){
      navigate('/friends')
    } else if(name === 'video'){
      navigate('/video')
    } else if(name === 'marketplace'){
      navigate('/marketplace')
    } else if(name === 'game'){
      navigate('/game')
    }
  }

  const searchHandler = async(e)=>{
    const value = e.target.value;
    setSearchBox(value);
    try {
        const res = await axios.get(`${backendurl}/api/v1/user/search?username=${value}`)
        if(res.data.success){
          setSearchResults(res.data.users)
          //use redux
          navigate('/searchusers')
        }
    } catch (error) {
      toast.error(response.data.message);
    }
  }
  return (
    <div className='h-16 w-screen border rounded-lg bg-white flex items-center justify-between'>
        <div className='flex items-center justify-start ml-4 gap-2'>
        <div> <img src={logo} alt="Logo" className="h-16 w-16 object-contain" /></div>
        <Input 
        name='search'
        value={searchBox}
        onChange = {searchHandler}
    className="border border-gray-300 rounded-xl
     bg-gray-100 outline-none focus:outline-none focus:ring-0
      focus:border-gray-300 focus:shadow-none"
  placeholder="Search Facebook"
   />
        </div>
        <div className='flex items-center justify-center gap-16'>
        <div><MdHome  className="cursor-pointer" onClick={() => navbarHandler("home")} size={24} />  </div>
        <div><FaUserFriends  className="cursor-pointer" onClick={() => navbarHandler("friends")} size={24}/> </div>
        <div><MdOndemandVideo className="cursor-pointer" onClick={() => navbarHandler("video")}  size={24}/>  </div>
        <div><CiShop  className="cursor-pointer" onClick={() => navbarHandler("marketplace")} size={24}/> </div>
        <div><IoGameControllerOutline  className="cursor-pointer" onClick={() => navbarHandler("game")} size={24}/>  </div>
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
