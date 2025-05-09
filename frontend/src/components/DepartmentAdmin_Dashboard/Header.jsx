import React, { useEffect, useState } from "react";
import { Bell, Menu, MessageSquare, Search, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { useDepartmentStore } from "../../store/useDepartmentStore";

const Header = () => {
  const { reqUserDepartment, getUserDepartment } = useDepartmentStore();
  const { logout } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState({
    search: false,
    alerts: false,
    messages: false,
    user: false,
  });

  useEffect(() => {
    getUserDepartment();
  }, []);

  const toggleDropdown = (key) => {
    setIsDropdownOpen((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 flex items-center justify-end h-16">
        {/* Mobile Menu Toggle */}
        <button className="md:hidden p-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-white transition">
          <Menu className="w-6 h-6" />
        </button>

        {/* Search Bar (Hidden on Mobile) */}
        {/* <div className="hidden md:flex items-center bg-gray-100 rounded-lg overflow-hidden w-80">
          <input
            type="text"
            placeholder="Search..."
            className="flex-1 px-3 py-2 text-gray-700 focus:outline-none bg-transparent"
          />
          <button className="px-4 py-2 bg-pink-500 text-white hover:bg-pink-600 transition">
            <Search className="w-5 h-5" />
          </button>
        </div> */}

        {/* Icons & Dropdowns */}
        <div className="flex items-center space-x-4">
          {/* Alerts Dropdown */}
          <div className="relative">
            <button
              className="relative p-2 rounded-full hover:bg-gray-100 transition"
              onClick={() => toggleDropdown("alerts")}
            >
              <Bell className="w-6 h-6 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            {isDropdownOpen.alerts && (
              <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4 z-50">
                <h6 className="text-sm font-semibold mb-2">Alerts</h6>
                <div className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg">
                  <Bell className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm">New report available</p>
                    <p className="text-xs text-gray-500">2 mins ago</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Messages Dropdown */}
          <div className="relative">
            <button
              className="relative p-2 rounded-full hover:bg-gray-100 transition"
              onClick={() => toggleDropdown("messages")}
            >
              <MessageSquare className="w-6 h-6 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            {isDropdownOpen.messages && (
              <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4 z-50">
                <h6 className="text-sm font-semibold mb-2">Messages</h6>
                <div className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg">
                  <img
                    src="https://via.placeholder.com/40"
                    alt="User"
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="text-sm font-medium">New message</p>
                    <p className="text-xs text-gray-500">5 mins ago</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Dropdown */}
          <div className="relative">
            <button
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition"
              onClick={() => toggleDropdown("user")}
            >
              <span className="hidden md:inline text-gray-600">
                {reqUserDepartment?.name.length > 10
                  ? `${reqUserDepartment?.name.slice(0, 8)}…`
                  : reqUserDepartment?.name}
              </span>

              <User className="w-6 h-6 text-gray-600" />
            </button>
            {isDropdownOpen.user && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-50">
                <a
                  href="#"
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Settings
                </a>

                <button
                  className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-start"
                  onClick={logout}
                >
                  <span className=" hidden sm:inline">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
