import axios from "axios";
import React, { useEffect, useState } from "react";
import { backendurl } from "../../configurl";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useNavigate } from "react-router-dom";


const Friends = () => {
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const res = await axios.get(`${backendurl}/api/v1/user/suggesteduser`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setFriends(res.data.users);
        }
      } catch (error) {
        console.error("Error fetching suggested users:", error);
      }
    };
  
    fetchSuggestedUsers();
  }, []); 
  

  return (
    <div className="w-1/2 flex flex-col ">
    {friends.length === 0 ? (
      <p className="text-gray-500">No suggested friends available.</p>
    ) : (
      friends.map((user) => (
        <div
          className="hover:bg-gray-100 cursor-pointer flex items-center justify-between gap-4 p-4"
          key={user._id}
          onClick={() => navigate(`/profile/${user._id}`)}
        >
          <div className="ml-6">
          <Avatar  className="w-16 h-16 " >
            <AvatarImage className="w-full h-full object-cover" src={user.profilePicture} alt={user.username} />
            <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
          </Avatar>
          </div>
          <span className="font-medium mr-6">{user?.bio}</span>
          <span className="font-medium mr-6">{user.username}</span>
        </div>
      ))
    )}
  </div>
);
};

export default Friends;
