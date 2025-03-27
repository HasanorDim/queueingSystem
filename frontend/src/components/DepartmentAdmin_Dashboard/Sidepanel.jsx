import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const [queueDropdownOpen, setQueueDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <div className="bg-gradient-to-b h-screen text-white w-64 fixed from-pink-500 md:relative pt-5 px-5 to-pink-700">
      {/* Branding */}
      <a href="/admin/dashboard" className="flex flex-col items-center">
        <div className="text-3xl font-bold">Queueing</div>
        <div className="text-xs font-normal mt-1">CITY TREASURER'S OFFICE</div>
      </a>

      <hr className="border-white/30 my-2" />

      <ul>
        {/* Dashboard Link */}
        <li className="hover:bg-pink-600 px-4 py-2 transition">
          <NavLink
            to="/department-dashboard"
            className="flex items-center space-x-2"
          >
            <i className="fa-tachometer-alt fas"></i>
            <span>Dashboard</span>
          </NavLink>
        </li>

        <hr className="border-white/30 my-2" />

        {/* Interface Section */}
        <div className="text-xs font-semibold px-4 tracking-wider uppercase">
          Interface
        </div>

        {/* Manage Queues Dropdown */}
        <li className="mt-2">
          <button
            className="flex justify-between w-full duration-300 ease-in-out hover:bg-pink-600 items-center px-4 py-2 transition"
            onClick={() => setQueueDropdownOpen(!queueDropdownOpen)}
          >
            <div className="flex items-center space-x-2">
              <i className="fa-walking fas"></i>
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
                Windows | Office
              </NavLink>
            </li>
          </ul>
        </li>

        {/* Manage Users Dropdown */}
        <li className="mt-2">
          <button
            className="flex justify-between w-full duration-300 ease-in-out hover:bg-pink-600 items-center px-4 py-2 transition"
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
          >
            <div className="flex gap-2 items-center space-x-2">
              <i className="w-2 fa-users fas"></i>
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
