import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const [queueDropdownOpen, setQueueDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <div className="h-screen w-64 bg-gradient-to-b from-pink-500 to-pink-700 text-white px-5 pt-5 fixed md:relative">
      {/* Branding */}
      <a href="/admin/dashboard" className="flex flex-col items-center">
        <div className="text-3xl font-bold">Queueing</div>
        <div className="text-xs font-normal mt-1">CITY TREASURER'S OFFICE</div>
      </a>

      <hr className="border-white/30 my-2" />

      <ul>
        {/* Dashboard Link */}
        <li className="px-4 py-2 hover:bg-pink-600 transition">
          <NavLink
            to="/department-dashboard"
            className="flex items-center space-x-2"
          >
            <i className="fas fa-tachometer-alt"></i>
            <span>Dashboard</span>
          </NavLink>
        </li>

        <hr className="border-white/30 my-2" />

        {/* Interface Section */}
        <div className="px-4 text-xs uppercase font-semibold tracking-wider">
          Interface
        </div>

        {/* Manage Queues Dropdown */}
        <li className="mt-2">
          <button
            className="w-full flex items-center justify-between px-4 py-2 hover:bg-pink-600 transition ease-in-out duration-300"
            onClick={() => setQueueDropdownOpen(!queueDropdownOpen)}
          >
            <div className="flex items-center space-x-2">
              <i className="fas fa-walking"></i>
              <span>Overview Queues</span>
            </div>
            <i
              className={`fas fa-chevron-down transform transition-transform duration-300 ${
                queueDropdownOpen ? "rotate-180" : ""
              }`}
            ></i>
          </button>

          {/* Dropdown Content */}
          <ul
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              queueDropdownOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
            } bg-white py-2 rounded`}
          >
            <li>
              <NavLink
                to="/department-dashboard/ticket-view"
                className={({ isActive }) =>
                  `block px-6 py-1 text-gray-700 ${
                    isActive
                      ? "bg-slate-400 text-white hover:bg-gray-500"
                      : "hover:bg-gray-200"
                  }`
                }
              >
                View Existing Queues
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/department-dashboard/windows"
                className={({ isActive }) =>
                  `block px-6 py-1 text-gray-700 ${
                    isActive
                      ? "bg-slate-400 text-white hover:bg-gray-500"
                      : "hover:bg-gray-200"
                  }`
                }
              >
                Windows
              </NavLink>
            </li>
          </ul>
        </li>

        {/* Manage Users Dropdown */}
        <li className="mt-2">
          <button
            className="w-full flex items-center justify-between px-4 py-2 hover:bg-pink-600 transition ease-in-out duration-300"
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
          >
            <div className="flex items-center space-x-2 gap-2">
              <i className="fas fa-users w-2"></i>
              <span>Mnge Department</span>
            </div>
            <i
              className={`fas fa-chevron-down transform transition-transform duration-300 ${
                userDropdownOpen ? "rotate-180" : ""
              }`}
            ></i>
          </button>

          {/* Dropdown Content */}
          <ul
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              userDropdownOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
            } bg-white py-2 rounded`}
          >
            <li>
              <NavLink
                to="/department-dashboard/manage-windows"
                className={({ isActive }) =>
                  `block px-6 py-1 text-gray-700 ${
                    isActive
                      ? "bg-slate-400 text-white hover:bg-gray-500"
                      : "hover:bg-gray-200"
                  }`
                }
              >
                Windows
              </NavLink>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
