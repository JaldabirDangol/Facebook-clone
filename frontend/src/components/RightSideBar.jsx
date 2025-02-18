import { PiPaperPlaneRightFill } from "react-icons/pi";
import courseraads from '../assets/courseraads.png'
import schoolads from '../assets/schoolads.jpg'
import { useDispatch, useSelector } from "react-redux";
import useGetAllUsers from "@/hooks/useGetAllUsers";
import { setSelectedUser } from "../../store/authSlice";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const RightSideBar = () => {
  useGetAllUsers();
  const { user, selectedUser, allUsers } = useSelector(store => store.auth);
  const { onlineUsers, messages } = useSelector(store => store.chat);
  const [selectedUserHighlight, setSelectedUserHighlight] = useState(null);
  const dispatch = useDispatch()

  useEffect(() => {
    return () => {
        dispatch(setSelectedUser(null));
    }
}, []);

  return (
    <div className='h-screen flex flex-col bg-gray-100 ' >
       <div className='mr-8 ml-4 h-screen mt-2'>
       <h2>Sponsored</h2>
       <div className='flex items-center gap-2'>
          <img src={courseraads} alt="Logo" className="h-34 border rounded-sm mt-4 w-28 object-contain" />
          <div className='flex flex-col'>
          <p className='font-semibold'>Your career will thank you</p>
          <span className='text-slate-400'>Coursera.org</span>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <img src={schoolads} alt="Logo" className="h-34 mt-4 border rounded-sm w-28 object-contain" />
          <div className='flex flex-col'>
          <p className='font-semibold'>Your career will thank you</p>
          <span className='text-slate-400'>Coursera.org</span>
          </div>
        </div>
        <hr className="border-slate-300  mt-6" />
        <h2 className='mt-4 text-slate-700 font-bold'>Groups chats</h2>
        <h2 className='mt-4 text-slate-700 font-bold'>Online User</h2>
        <div className='flex items-center gap-2 flex-col'>
 
    
       

          
        </div>
    

        </div>
       </div>
  )
}

export default RightSideBar