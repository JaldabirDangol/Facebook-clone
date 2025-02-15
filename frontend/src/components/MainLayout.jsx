import React, { useEffect } from "react";
import { Navbar } from "./Navbar";
import { Outlet } from "react-router-dom";
import LeftSideBar from "./LeftSideBar";
import RightSideBar from "./RightSideBar";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { backendurl } from "../../configurl";
import { setAuthUser } from "../../store/authSlice";

const MainLayout = () => {
   const dispatch= useDispatch()
 
   useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`${backendurl}/api/v1/user/getuserdata`, {
          withCredentials: true,
        });

        if (res.data.success) {
          dispatch(setAuthUser(res.data.user));
        }
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [dispatch])
  return (
    <div className="w-screen h-screen">
      <Navbar />
      <div className="flex justify-between ">
        <LeftSideBar />
          <Outlet />
        <RightSideBar />
      </div>
    </div>
  );
};

export default MainLayout;
