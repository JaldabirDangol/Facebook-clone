import { Navbar } from "./Navbar";
import { Outlet } from "react-router-dom";
import LeftSideBar from "./LeftSideBar";
import RightSideBar from "./RightSideBar";
import { useState } from "react";
import { Button } from "./ui/button";
import { MoreVertical } from "lucide-react";
import { FaHamburger } from "react-icons/fa";


const MainLayout = () => {
  const [hiddenLeft, setHiddenLeft] = useState(false)
  const [hiddenRight, setHiddenRight] = useState(false)
  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden">
    <div className="sticky top-0 z-50 w-full">
      <Navbar />
    </div>
    <div className="flex flex-grow overflow-hidden">
      <div
        className={`fixed top-16 left-0 h-full w-full md:w-[25%] bg-gray-100 overflow-y-auto scrollbar-thin shadow-lg transition-transform duration-300 z-50 ${hiddenLeft ? "translate-x-0" : "-translate-x-full"
          } md:static md:translate-x-0`}
      >
        <LeftSideBar />
      </div>
      <FaHamburger
        className="absolute  top-50 z-50 md:hidden text-xl "
        onClick={() => setHiddenLeft(!hiddenLeft)}
      ></FaHamburger>
      <div className="flex-grow h-screen overflow-y-auto scrollbar-none">
        <Outlet />
      </div>
        <div
               className={`fixed h-full w-full md:w-[25%] bg-gray-100 overflow-y-auto scrollbar-thin shadow-lg transition-transform duration-300 z-50 ${hiddenRight ? "translate-x-0" : "translate-x-full"
          } md:static md:translate-x-0`}
      >
        <RightSideBar />
      </div>
      <FaHamburger 
        className="absolute top-50 right-0 z-50 md:hidden text-xl"
        onClick={() => setHiddenRight(!hiddenRight)}
      >
      </FaHamburger>
    </div>
  </div>
  );
};

export default MainLayout;
