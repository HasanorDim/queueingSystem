import React from "react";
import Navbar from "../../components/userpage/Navbar";
import UserMainContent from "../../components/userpage/UserMainContent";

const UserContent = () => {
  return (
    <div className="h-screen w-screen flex flex-col">
      {/* Navbar Stays at the Top */}
      <Navbar className="w-full fixed top-0 z-10" />

      {/* Main Content Takes Remaining Height */}
      <div className="flex-grow">
        <UserMainContent />
      </div>
    </div>
  );
};

export default UserContent;
