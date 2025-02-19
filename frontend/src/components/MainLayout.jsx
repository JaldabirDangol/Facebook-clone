import { Navbar } from "./Navbar";
import { Outlet } from "react-router-dom";
import LeftSideBar from "./LeftSideBar";
import RightSideBar from "./RightSideBar";


const MainLayout = () => {
  return (
    <div className="w-screen h-screen flex flex-col">
    {/* Navbar (Sticky) */}
    <div className="sticky top-0 z-50 w-full">
      <Navbar />
    </div>
  
    <div className="flex flex-grow overflow-hidden">
      <div className="hidden md:block bg-gray-100 w-[25%] h-screen sticky top-16 overflow-y-auto">
        <LeftSideBar /> 
      </div>
  
      <div className="flex-grow h-screen overflow-y-auto scrollbar-none">
        <Outlet />
      </div>
  
      <div className="hidden md:block bg-gray-100 w-[25%] h-screen sticky top-16 overflow-y-auto">
        <RightSideBar /> 
      </div>
    </div>
  </div>
  
  
  );
};

export default MainLayout;
