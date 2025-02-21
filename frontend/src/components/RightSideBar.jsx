import courseraads from '../assets/courseraads.png'
import schoolads from '../assets/schoolads.jpg'
import useGetAllUsers from '@/hooks/useGetAllUsers'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { GoDotFill } from "react-icons/go";
import { useNavigate } from 'react-router-dom'

const RightSideBar = () => {
  const navigate =useNavigate()
  useGetAllUsers();
  const { selectedUser, allUsers } = useSelector(store => store.auth);
  const { onlineUsers} = useSelector(store => store.chat);


  return (
    <div className='h-screen w-full flex flex-col ' >
      <div className='mr-6 ml-4 h-screen mt-2'>
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
        <h2 className='mt-4 text-slate-700 font-bold'>Contacts</h2>
        <div className='mt-1 border rounded-lg overflow-y-auto scrollbar-none mb-10  h-[43vh]'>
          {allUsers.map((allUser) => {
            const isOnline = onlineUsers.includes(allUser?._id);
            const isSelected = selectedUser?._id === allUser?._id;
            return (
              <div key={allUser?._id} onClick={()=>navigate('/chat')} className={`flex gap-3 bg-gray-100 items-center py-2 px-3 my-1 hover:bg-gray-200 cursor-pointer rounded-full ${isSelected ? 'bg-gray-200 hover:bg-gray-200' : ''}`}>
                <Avatar className='w-12 h-12'>
                  <AvatarImage src={allUser?.profilePicture} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className='flex items-center gap-3'>
                  <span className='font-medium'>{allUser?.username}</span>
                  <span className={` rounded-full ${isOnline ? 'text-green-500' : 'text-red-500'}`}><GoDotFill/></span>
                </div>
              </div>
            );
          })}
        </div>


      </div>
    </div>
  )
}

export default RightSideBar