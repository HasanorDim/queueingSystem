import React from "react";
import Navbar from "../../components/userpage/Navbar";
import UserMainContent from "../../components/userpage/UserMainContent";
import { Outlet } from "react-router-dom";

const UserContent = () => {
  return (
    <div className="h-full w-full flex flex-col bg-[#eee]">
      {/* Navbar Stays at the Top */}
      <Navbar className="w-full fixed top-0 z-10" />

      {/* Main Content Takes Remaining Height */}
      <div className="relative h-lex-grow overflow-hidden pb-10">
        <Outlet />
      </div>
    </div>
  );
};

export default UserContent;
