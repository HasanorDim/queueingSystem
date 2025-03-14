import React, { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const { logout } = useAuthStore();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  return (
    <nav className="bg-white fixed w-full z-10 top-0 shadow">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo & Title */}
        <a
          className="flex items-center text-pink-500 text-xl font-extrabold font-sans"
          href="#"
        >
          <img
            className="w-8 h-8 rounded-full object-cover mr-2"
            src="/images/linefour.png"
            alt="Logo"
          />
          Queueing - City Treasurer's Office
        </a>

        {/* Right Side Icons */}
        <div className="flex items-center space-x-4">
          {/* Notification Button */}
          <div className="relative">
            <button
              onClick={() => {
                setIsNotifOpen(!isNotifOpen);
                if (isUserMenuOpen) setIsUserMenuOpen(!isUserMenuOpen);
              }}
              className="relative flex items-center text-white bg-pink-500 hover:bg-pink-400 px-4 py-2 rounded-lg shadow transition"
            >
              <img
                className="w-5 h-5 mr-2"
                src="/images/notification.png"
                alt="Notification Icon"
              />
              <span className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full hidden">
                !
              </span>
            </button>

            {/* Notification Dropdown */}
            {isNotifOpen && (
              <div className="absolute right-0 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto p-2 space-y-2">
                <p className="text-sm text-gray-700">No new notifications</p>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setIsUserMenuOpen(!isUserMenuOpen);
                if (isNotifOpen) setIsNotifOpen(!isNotifOpen);
              }}
              className="relative flex items-center bg-pink-700 hover:bg-pink-500 text-white font-bold py-2 px-4 rounded shadow"
            >
              Menu
              <svg
                className="pl-2 h-4 w-4 fill-current text-white"
                viewBox="0 0 129 129"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="m121.3,34.6c-1.6-1.6-4.2-1.6-5.8,0l-51,51.1-51.1-51.1c-1.6-1.6-4.2-1.6-5.8,0-1.6,1.6-1.6,4.2 0,5.8l53.9,53.9c0.8,0.8 1.8,1.2 2.9,1.2 1,0 2.1-0.4 2.9-1.2l53.9-53.9c1.7-1.6 1.7-4.2 0.1-5.8z" />
              </svg>
            </button>

            {/* User Dropdown */}
            {isUserMenuOpen && (
              <div className="absolute botton-0 right-0 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-50 overflow-hidden">
                <ul className="list-none">
                  <li>
                    <a
                      href="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
                    >
                      My Account
                    </a>
                  </li>
                  <li>
                    <NavLink
                      to="/UserTicket-inqueue"
                      className={({ isActive }) =>
                        `block px-4 py-2 text-gray-700 hover:bg-gray-200 ${
                          isActive ? "bg-pink-600" : ""
                        }`
                      }
                    >
                      In Queue
                    </NavLink>
                  </li>
                  <li>
                    <hr className="border-t border-gray-300 mx-2" />
                  </li>
                  <li>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-pink-600 font-bold hover:bg-pink-600 hover:text-white"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
