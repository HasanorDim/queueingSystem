import React, { useEffect } from "react";
import Header from "../../components/SuperAdmin_Dashboard/Header";
import Sidepanel from "../../components/SuperAdmin_Dashboard/Sidepanel";
import { Outlet } from "react-router-dom";
import { useDepartmentStore } from "../../store/useDepartmentStore";

const Dashboard = () => {
  const { getAllDepartments } = useDepartmentStore();

  useEffect(() => {
    getAllDepartments();
  }, [getAllDepartments]);

  return (
    <div className="flex w-full h-screen overflow-hidden">
      {/* SidePanel */}
      <Sidepanel />

      {/* Header Content */}
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <Header />
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto scrollbar-gutter-stable">
          <Outlet /> {/* This renders the active nested route */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
