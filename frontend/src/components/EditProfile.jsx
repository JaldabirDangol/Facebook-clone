import React, { useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import blankprofilepic from '../assets/blankprofilepic.png'
import blankcoverpic from '../assets/blankcoverpic.png'
import { Button } from './ui/button'
import { useSelector } from 'react-redux'

const EditProfile = ({open,setOpen ,userProfile}) => {
    const [gender, setGender] = useState("");
    const [bio, setBio] = useState(""); 
    const handleChange = (e) => {
        setBio(e.target.value);
        e.target.style.height = "auto"; 
        e.target.style.height = `${e.target.scrollHeight}px`
      };
   const { user } = useSelector(store => store.auth);

   const submitHandler = ()=>{

   }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent onInteractOutside={() => setOpen(false)}>
      <DialogTitle >Edit Profile</DialogTitle>
      <div className="border rounded-lg  p-4 bg-slate-50">

        <div className='font-semibold text-xl'>
            Profile picture
          <div className='flex justify-center items-center'>
        {
          userProfile&&
            userProfile.profilePicture ? (
                <Avatar className='mt-4 h-32 w-32'>
            <AvatarImage src={userProfile.profilePicture} />
            <AvatarFallback/>
            </Avatar>
            ):(
                <Avatar className='mt-4 h-32 w-32 '>
                <AvatarImage  src={blankprofilepic} />
                <AvatarFallback/>
                </Avatar>
            )
        }
          </div>
        </div>

        <div className='font-semibold text-xl'>
            Cover photo
          <div className='flex justify-center items-center mt-4'>
        { userProfile &&
            userProfile.coverPicture ? (
                     <img src={userProfile.coverPicture} className=' border rounded-xl'  />
            ):(
                <img className=' border rounded-xl' src={blankcoverpic}  />
            )
        }
          </div>
        </div>
       

       <div className='font semibold text-xl mt-2'>
        Bio
           <div className='flex justify-center'>
           <textarea
          className="outline-none border rounded-md p-2 w-full resize-none overflow-hidden min-h-[40px]"
          placeholder="Describe Yourself"
          value={bio}
          onChange={handleChange} // Pass event to the function
          rows={1}
          style={{ minHeight: "40px" }} // Ensure a default height
        />
           </div>
       </div> 

       <div className="flex items-center space-x-4 font-semibold text-xl mt-4">
               Gender
        <label className="flex items-center space-x-2 cursor-pointer ml-4">
          <input
            type="radio"
            name="gender"
            value="male"
            checked={gender === "male"}
            onChange={() => setGender("male")}
            className="w-5 h-5 cursor-pointer"
          />
          <span className="text-lg">Male</span>
        </label>

      
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name="gender"
            value="female"
            checked={gender === "female"}
            onChange={() => setGender("female")}
            className="w-5 h-5 cursor-pointer"
          />
          <span className="text-lg">Female</span>
        </label>
      </div>
      
          
      <Button type='submit' onClick={submitHandler} className='w-full mt-4'> Submit</Button>


      </div>
    </DialogContent>
  </Dialog>
  )
}

export default EditProfile