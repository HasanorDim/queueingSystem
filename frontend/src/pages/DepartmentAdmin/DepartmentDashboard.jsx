import React from "react";
import Sidepanel from "../../components/DepartmentAdmin_Dashboard/Sidepanel";
import { Outlet } from "react-router-dom";
import Header from "../../components/DepartmentAdmin_Dashboard/Header";

const DepartmentDashboard = () => {
  return (
    <div className="flex w-full h-screen overflow-hidden bg-[#eeee]">
      {/* SidePanel */}
      <Sidepanel />

      {/* Header Content */}
      <div className="relative flex flex-1 flex-col overflow-hidden bg">
        <Header />
        {/* Main Content */}
        <div className="relative flex-1 overflow-y-auto scrollbar-gutter-stable">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DepartmentDashboard;
