import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUserProfile } from "../../store/authSlice";
import { backendurl } from "../../configurl";
import { useNavigate } from "react-router-dom";

const useGetUserProfile = (userId) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  useEffect(() => {
    if (!userId) {
      console.log("Invalid userId:", userId);
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(`${backendurl}/api/v1/user/profile/${userId}`, {
          withCredentials: true,
        });
 
        if (res.data.success) {
          dispatch(setUserProfile(res.data.user));
        }
      } catch (error) {
        console.log("Error fetching user profile:", error);

        if (error.response && error.response.status === 401) {
          console.log("User is not authenticated. Redirecting to login...");
          navigate("/login"); 
        }
      }
    };

    fetchUserProfile();
  }, [userId, dispatch, navigate]);
};

export default useGetUserProfile;