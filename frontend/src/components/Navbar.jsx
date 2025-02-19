import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { MdOndemandVideo } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { MdHome } from "react-icons/md";
import { FaUserFriends } from "react-icons/fa";
import { TbCube } from "react-icons/tb";
import { FaFacebookMessenger } from "react-icons/fa";
import { IoNotifications } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { IoGameControllerOutline } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { Input } from "./ui/input";
import { CiShop } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { backendurl } from "../../configurl";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { setNotification } from "../../store/rtnSlice";
import { setAllpost } from "../../store/postSlice";
import { setAuthUser } from "../../store/authSlice";
import { HelpCircle, LogOut, Settings } from "lucide-react";

export const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [searchBox, setSearchBox] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { notification } = useSelector((store) => store.rtn);
  const [openProfile ,setOpenProfile] = useState(false)
  const [settingOpen,setSettingOpen] = useState(false)

  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchBox.trim()) {
        fetchSearchResults(searchBox);
      } else {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [searchBox]);

  const clearNotificationHandler = () => {
    dispatch(setNotification({ reaction: "clear" }));
  };
  const navbarHandler = (name) => {
    if (name === "home") {
      navigate("/");
    } else if (name === "friends") {
      navigate("/friends");
    } 
  };
  const fetchSearchResults = async (e) => {
    const value = e;
    setLoading(true);
    try {
      const res = await axios.get(
        `${backendurl}/api/v1/user/search?username=${value}`,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        setSearchResults(res.data.users);
      }
    } catch (error) {
      toast.error("Error fetching users");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const logOutHandler = async () => {
    try {
      const res = await axios.get(`${backendurl}/api/v1/user/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setAllpost(null))
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    }
  };

  const passwordHandler = async()=>{
    try {
      const res = await axios.post(`${backendurl}/api/v1/user/changepassword`,{
        oldPassword,newPassword
      },
        {
          withCredentials:true
        }
      )

      if(res.data.success){
        toast.success(res.data.message)
        setOldPassword("");
        setNewPassword("")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const deleteAccountHandler = async()=>{
    try {
      const res = await axios.delete(`${backendurl}/api/v1/user/deleteaccount`,{
        withCredentials:true
      })

      if (res.data.success){
        toast.success(res.data.message);
        dispatch(setAuthUser(null))
        navigate('/signup')
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="w-screen border rounded-lg bg-white flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center justify-start ml-4 gap-2">
        <img
          src={logo}
          alt="Logo"
          className="h-16 w-16 object-contain cursor-pointer"
        />
        <div className="flex items-center relative w-1/2 md:w-full">
          <CiSearch size={18} className="absolute left-2 cursor-pointer" />
          <Input
            name="search"
            type="text"
            value={searchBox}
            onChange={(e) => setSearchBox(e.target.value)}
            className="border border-gray-300 rounded-xl
     bg-gray-100 outline-none focus:outline-none focus:ring-0
      focus:border-gray-300 focus:shadow-none md:w-80 w-20 focus:w-80 transition-all duration-300"
            placeholder="Search Facebook"
          />
          {searchBox.trim() && (
            <div className="absolute top-14 bg-white shadow-md  w-full max-h-60 overflow-y-auto border rounded-md z-20">
              {loading ? (
                <p className="text-gray-500 p-2">Loading...</p>
              ) : searchResults.length > 0 ? (
                searchResults.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => navigate(`/profile/${user._id}`)}
                  >
                    <Avatar>
                      <AvatarImage src={user.profilePicture} />
                      <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.username}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 p-2">No users found</p>
              )}
            </div>
          )}
        </div>
      </div>

      
      <div className="flex items-center justify-center md:gap-16 gap-2">
        <div>
          <MdHome
            className="cursor-pointer"
            onClick={() => navbarHandler("home")}
            size={24}
          />{" "}
        </div>
        <div>
          <FaUserFriends
            className="cursor-pointer"
            onClick={() => navbarHandler("friends")}
            size={24}
          />{" "}
        </div>
        <div className="hidden md:block cursor-pointer">
          <MdOndemandVideo
            size={24}
          />{" "}
        </div>
        <div className="hidden md:block cursor-pointer">
          <CiShop
            size={24}
          />{" "}
        </div>
        <div className="hidden md:block cursor-pointer">
          <IoGameControllerOutline
            onClick={() => navbarHandler("game")}
            size={24}
          />{" "}
        </div>
      </div>

      <div className="mr-8 flex justify-end gap-4 cursor-pointer">
        <div className="hidden md:block cursor-pointer">
          <TbCube size={24} />
        </div>
        <div onClick={()=>navigate('/chat')}>
          <FaFacebookMessenger size={24} />
        </div>

        <div className="relative">
          <IoNotifications size={24} />
          {notification?.length > 0 && (
            <Popover>
              <PopoverTrigger asChild>
                <Button className="rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 absolute bottom-6 ">
                  {notification?.length}
                </Button>
              </PopoverTrigger>
              <PopoverContent onInteractOutside={clearNotificationHandler}>
                <div>
                  {notification?.length === 0 ? (
                    <p>No new notification</p>
                  ) : (
                    notification &&
                    notification.map((notification) => {
                      return (
                        <div
                          key={notification._id}
                          className="flex items-center gap-2 my-2"
                        >
                          <Avatar>
                            <AvatarImage
                              src={notification.author?.profilePicture}
                            />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                          <p className="text-sm">
                            <span className="font-bold">
                              {notification.author?.username}
                            </span>{" "}
                            {notification.reaction === "like" && (
                              <span>react like on your post</span>
                            )}
                            {notification.reaction === "love" && (
                              <span>react love on your post</span>
                            )}
                            {notification.reaction === "wow" && (
                              <span>react wow on your post</span>
                            )}
                            {notification.reaction === "sad" && (
                              <span>react sad on your post</span>
                            )}
                            {notification.reaction === "angry" && (
                              <span>react angry on your post</span>
                            )}
                            {notification.reaction === "haha" && (
                              <span>react haha on your post</span>
                            )}
                            {notification?.text && (
                              <span>comment  on your post</span>
                            )}
                            {
                              notification?.issharedpost && (
                                <span>share your post</span>
                              )
                            }
                          </p>
                        </div>
                      );
                    })
                  )}
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
        
        <div>
          <Popover>
              <PopoverTrigger asChild>
                   <Avatar onClick={()=>setOpenProfile(true)} className="w-7 h-7">
                   <AvatarImage src={user?.profilePicture} />
                   <AvatarFallback>CN</AvatarFallback>
                  </Avatar> 
              </PopoverTrigger>
              <PopoverContent onInteractOutside={()=>setOpenProfile(false)}>
                <div className="flex flex-col cursor-pointer">


                   <div className="flex">
            <Avatar className="w-7 h-7">
            <AvatarImage src={user?.profilePicture} />
            <AvatarFallback>CN</AvatarFallback>
            </Avatar>  
            <span className="ml-4">{user?.username}</span>
                   </div>
                   <hr className="border-b bg-black w-full my-2"/>
                   <span onClick={()=>navigate(`profile/${user._id}`)} className="text-blue-500 font-semibold">See all profiles</span>

               <div className="flex items-center gap-2 mt-2">
              <HelpCircle  size={24} color="#422e2e"/>
              <span>Help & support</span>
              </div>

              <div onClick={()=>setSettingOpen(!settingOpen)} className="flex items-center gap-2 mt-2">
              <Settings   size={24} color="#422e2e"/>
              <span>Settings & privacy</span>
              </div>

     {
      settingOpen && (
        <div className="flex flex-col mt-2">
                  <div onClick={deleteAccountHandler} className="flex items-center ">
                  <MdDelete  size={24}/>
                  <span className="ml-2">Delete account</span>
                  </div>
                <div>
                <div className="font-semibold text-lg mt-2">
            Change Password (Optional)
            <input
              type="password"
              placeholder="Old Password"
              className="border rounded-md p-1 h-[30px] text-sm w-full mt-2"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              className="border rounded-md p-1 h-[30px] text-sm w-full mt-2"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Button className='mt-2' onClick={passwordHandler}>Change Password</Button>
          </div>
                </div>
        </div>
      )
     }
              <div onClick={logOutHandler} className="flex items-center gap-2 mt-2">
              <LogOut  size={24} color="#422e2e"/>
              <span>Logout</span>
              </div>
                </div>
              </PopoverContent>
            </Popover>

        </div>


      </div>



    </div>
  );
};
