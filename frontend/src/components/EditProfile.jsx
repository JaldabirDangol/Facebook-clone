import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import blankprofilepic from "../assets/blankprofilepic.png";
import blankcoverpic from "../assets/blankcoverpic.png";
import { Button } from "./ui/button";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { backendurl } from "../../configurl";
import { setUserProfile } from "../../store/authSlice";
import { toast } from "sonner";

const EditProfile = ({ open, setOpen, userProfile }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const [bio, setBio] = useState(userProfile?.bio || "");
  const [gender, setGender] = useState(userProfile?.gender || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null);

  const [profilePreview, setProfilePreview] = useState(
    userProfile?.profilePicture || blankprofilepic
  );
  const [coverPreview, setCoverPreview] = useState(
    userProfile?.coverPicture || blankcoverpic
  );

  useEffect(() => {
    if (open) {
  
      setBio("");
      setGender("");
      setOldPassword("");
      setNewPassword("");
      setProfilePhoto(null);
      setCoverPhoto(null);
      setProfilePreview(userProfile?.profilePicture || blankprofilepic);
      setCoverPreview(userProfile?.coverPicture || blankcoverpic);
    }
  }, [open]); 
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const handleCoverPicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverPhoto(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (bio) formData.append("bio", bio);
    if (gender) formData.append("gender", gender);
    if (oldPassword) formData.append("oldPassword", oldPassword);
    if (newPassword) formData.append("newPassword", newPassword);
    if (profilePhoto) formData.append("profilePhoto", profilePhoto);
    if (coverPhoto) formData.append("coverPhoto", coverPhoto);

    try {
      const res = await axios.post(
        `${backendurl}/api/v1/user/profile/${user._id}/editprofile`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setUserProfile(res.data.user));
        toast.success(res.data.message)
       
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent onInteractOutside={() => setOpen(false)}>
        <DialogTitle>Edit Profile</DialogTitle>
        <form
          onSubmit={handleProfileUpdate}
          className="border rounded-lg p-2 bg-slate-50"
        >
          {/* Profile Picture */}
          <div className="font-semibold text-lg">
            Profile Picture
            <div className="flex justify-center items-center relative mt-2">
              <label htmlFor="profilePicInput" className="cursor-pointer">
                <Avatar className="h-28 w-28 border-2 border-gray-300 hover:border-blue-500">
                  <AvatarImage src={profilePreview} />
                  <AvatarFallback />
                </Avatar>
              </label>
              <input
                type="file"
                id="profilePicInput"
                accept="image/*"
                className="hidden"
                onChange={handleProfilePicChange}
              />
            </div>
          </div>

          {/* Cover Photo */}
          <div className="font-semibold text-lg mt-2">
            Cover Photo
            <div className="flex justify-center items-center mt-2 relative">
              <label htmlFor="coverPicInput" className="cursor-pointer">
                <img
                  src={coverPreview}
                  className="border rounded-xl w-full h-40 object-cover"
                />
              </label>
              <input
                type="file"
                id="coverPicInput"
                accept="image/*"
                className="hidden"
                onChange={handleCoverPicChange}
              />
            </div>
          </div>

          {/* Bio */}
          <div className="font-semibold text-lg mt-2">
            Bio
            <div className="flex justify-center">
              <textarea
                className="outline-none border rounded-md w-full min-h-[20px] max-h-[30px] p-1 text-sm leading-tight resize-none overflow-hidden"
                placeholder="Describe Yourself"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
          </div>

          {/* Gender */}
          <div className="flex items-center space-x-4 font-semibold text-lg mt-2">
            Gender
            <label className="flex items-center space-x-2 cursor-pointer ml-2">
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

          {/* Change Password */}
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
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full mt-4">
            Save Changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfile;
