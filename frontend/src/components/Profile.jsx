import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useNavigate, useParams } from "react-router-dom";
import blankcover from "../assets/blankcoverpic.png";
import blankprofilepic from "../assets/blankprofilepic.png";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { IoBookmarkOutline } from "react-icons/io5";
import { Camera, MoreHorizontal } from "lucide-react";
import Post from "./Post";
import { setSelectedPost } from "../../store/postSlice";
import EditProfile from "./EditProfile";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import CreatePost from "./CreatePost";
import axios from "axios";
import { backendurl } from "../../configurl";
import { toast } from "sonner";
import { setAuthUser, setUserProfile } from "../../store/authSlice";
import { RiDeleteBin6Line } from "react-icons/ri";

const Profile = () => {
  const navigate = useNavigate();
  const params = useParams();
  const userId = params.id; // target user's id
  useGetUserProfile(userId);
  
  const [activeTab, setActiveTab] = useState("posts");
  const { userProfile, user } = useSelector((store) => store.auth);
  const isLoggedInUserProfile = user?._id === userId;
  
  const [isFriend, setIsFriend] = useState(false);
  const [displayTab, setDisplayTab] = useState([]);
  const [bio, setBio] = useState("");
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  
  // Dropdown states for posts (if needed)
  const [dropdownStates, setDropdownStates] = useState({});

  // Update displayTab and friend state when user or profile changes
  useEffect(() => {
    setDisplayTab(userProfile?.posts || []);
    if (user && userProfile) {
      // Check if logged in user's friends include the target user's id
      if (user.freinds && user.freinds.includes(userId)) {
        setIsFriend(true);
      } else {
        setIsFriend(false);
      }
    }
  }, [userProfile, user, userId]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    let newDisplayTab = [];
    if (tab === "photos") {
      newDisplayTab = userProfile?.posts || [];
    } else if (tab === "posts") {
      newDisplayTab = userProfile?.posts || [];
    } else if (tab === "friends") {
      newDisplayTab = userProfile?.friends || [];
    } else if (tab === "about") {
      setBio(userProfile.bio || "");
    } else if (tab === "saved") {
      newDisplayTab = userProfile?.saved || [];
    }
    setDisplayTab(newDisplayTab);
  };

  // Friend Request Handler: toggles friend status on server
  const friendReqHandler = async () => {
    try {
      const res = await axios.get(
        `${backendurl}/api/v1/user/${userId}/friendorunfreind`,
        { withCredentials: true }
      );

      if (res.data.success) {
        // Update both logged in user and target user in store
        dispatch(setAuthUser(res.data.user));
        dispatch(setUserProfile(res.data.targetUser));
        // Check friend status from updated user data.
        setIsFriend(res.data.user.freinds.includes(userId));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error(error);
    }
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `${backendurl}/api/v1/post/delete/${selectedpost._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        // Update posts list as needed
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const bookmarkHandler = async () => {
    try {
      const res = await axios.get(
        `${backendurl}/api/v1/post/${selectedpost._id}/savepost`,
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-screen flex-grow relative">
      {/* Cover Photo */}
      <div className="relative w-full h-[60%]">
        {userProfile && userProfile.coverPicture ? (
          <img
            src={userProfile.coverPicture}
            alt="cover"
            className="w-[70%] h-[100%] object-center ml-[15%] rounded-lg"
          />
        ) : (
          <img
            src={blankcover}
            alt="cover"
            className="w-[70%] h-[100%] object-center ml-[15%] rounded-lg"
          />
        )}
        {isLoggedInUserProfile && (
          <button className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md">
            <Camera size={20} />
          </button>
        )}
      </div>

      {/* Profile Section */}
      <div className="flex justify-between bg-white p-6 shadow-md -mt-16 rounded-lg w-[70%] mx-[10%]">
        <div className="flex justify-start">
          <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
            {userProfile && userProfile.profilePicture ? (
              <AvatarImage src={userProfile.profilePicture} alt="profile" />
            ) : (
              <AvatarImage src={blankprofilepic} alt="profile" />
            )}
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold mt-14 ml-12">
              {userProfile?.username}
            </h2>
            <p className="text-gray-500 mt-4 ml-12">
              {userProfile?.friends?.length || 0} friends
            </p>
          </div>
        </div>
        <div className="mt-14 ml-6 flex gap-2">
          {isLoggedInUserProfile ? (
            <Button onClick={() => setOpen(!open)} variant="secondary">
              Edit Profile
            </Button>
          ) : (
            <Button
              onClick={friendReqHandler}
              className={isFriend ? "bg-gray-500 text-white" : "bg-blue-500 text-white"}
            >
              {isFriend ? "Remove Friend" : "Send Friend"}
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="w-full max-w-5xl mt-6">
        <div className="flex justify-center gap-10 border-b py-3 text-gray-600">
          {["posts", "about", "friends", "photos", "videos", "saved"].map((tab) => (
            <span
              key={tab}
              className={`cursor-pointer ${activeTab === tab ? "font-bold border-b-2 border-black" : ""}`}
              onClick={() => handleTabChange(tab)}
            >
              {tab.toUpperCase()}
            </span>
          ))}
        </div>
      </div>

      <div className="flex p-2 bg-gray-300 w-2/3 gap-4">
        {/* Sidebar */}
        <div className="flex flex-col w-[22%] border rounded-md bg-gray-100 p-2">
          <h2 className="font-semibold text-xl">Intro</h2>
          <div className="flex flex-col items-center gap-2">
            <h3 className="mt-2">{userProfile?.username}</h3>
            <button
              type="button"
              className="px-6 w-full bg-gray-200 border rounded-md"
              onClick={() => setOpen(!open)}
            >
              Edit Profile
            </button>
          </div>
          {userProfile && userProfile.gender && <p>Gender: {userProfile.gender}</p>}
          {userProfile?.bio && (
            <div className="mt-2">
              <span className="font-medium">Bio:</span>{" "}
              <p className="text-gray-700">{userProfile.bio}</p>
            </div>
          )}
        </div>

        {/* Dynamic Content Section */}
        <div className="flex-1 bg-white">
          {activeTab === "photos" && (
            <div className="grid grid-cols-3 gap-4">
              {displayTab.map((post) => (
                <div key={post._id} className="relative group cursor-pointer">
                  <img
                    src={post.image}
                    alt="post"
                    className="rounded-md w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {activeTab === "posts" && (
            <div className="flex flex-col w-full mt-2">
              {user._id === userProfile._id && <CreatePost />}
              {displayTab.map((post) => (
                <Post key={post._id} post={post} />
              ))}
            </div>
          )}

          {activeTab === "saved" && (
            <div className="flex flex-col">
              {displayTab.map((post) => (
                <div
                  key={post._id}
                  className="flex justify-between relative border rounded-md bg-slate-50 p-2"
                >
                  <div className="flex items-center">
                    <img
                      src={post.image}
                      alt="post"
                      className="rounded-lg w-2/6 mt-5 ml-5 mb-4 object-cover"
                    />
                    <span className="ml-10">{post.caption}</span>
                  </div>
                  <MoreHorizontal
                    onClick={(e) => {
                      e.stopPropagation();
                      setDropdownStates((prev) => ({
                        ...prev,
                        [post._id]: !prev[post._id],
                      }));
                      dispatch(setSelectedPost(post));
                    }}
                    className="cursor-pointer mr-4 mt-8"
                  />
                  {dropdownStates[post._id] && (
                    <div
                      className="absolute flex flex-col right-2 items-center ml-4
                                 top-14 bg-white shadow-md w-2/3 border rounded-md z-20 gap-2 my-2 cursor-pointer p-2"
                    >
                      <h2 className="mt-2">Post Options</h2>
                      {post.author._id === user._id && (
                        <h2
                          onClick={deletePostHandler}
                          className="flex items-center mr-1 cursor-pointer"
                        >
                          <RiDeleteBin6Line className="mr-1" />
                          Delete Post
                        </h2>
                      )}
                      <h2
                        onClick={bookmarkHandler}
                        className="flex items-center cursor-pointer"
                      >
                        <IoBookmarkOutline className="mr-1" />
                        Saved Post
                      </h2>
                      <h2
                        onClick={() => navigate(`/profile/${post.author._id}`)}
                        className="mb-2 flex items-center cursor-pointer"
                      >
                        <Avatar className="mr-2 h-4 w-4">
                          <AvatarImage src={post.author.profilePicture} />
                          <AvatarFallback>C</AvatarFallback>
                        </Avatar>
                        View Profile
                      </h2>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === "about" && (
            <div className="flex flex-col w-full border rounded-md bg-gray-100 p-2">
              <h2 className="font-semibold text-xl">Intro</h2>
              <div className="flex flex-col items-center gap-2">
                <h3 className="mt-2">{userProfile.username}</h3>
                <button type="button" className="px-6 w-full bg-gray-200 border rounded-md">
                  Edit Profile
                </button>
              </div>
              {userProfile.gender && <p>Gender: {userProfile.gender}</p>}
              {userProfile?.bio && (
                <div className="mt-2">
                  <span className="font-medium">Bio:</span>{" "}
                  <p className="text-gray-700">{userProfile.bio}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <EditProfile open={open} setOpen={setOpen} userProfile={userProfile} />
    </div>
  );
};

export default Profile;
