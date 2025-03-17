import React, { useState } from "react";

const Header = () => {
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [isAlertsDropdownOpen, setIsAlertsDropdownOpen] = useState(false);
  const [isMessagesDropdownOpen, setIsMessagesDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const toggleSearchDropdown = () => {
    setIsSearchDropdownOpen(!isSearchDropdownOpen);
  };

  const toggleAlertsDropdown = () => {
    setIsAlertsDropdownOpen(!isAlertsDropdownOpen);
  };

  const toggleMessagesDropdown = () => {
    setIsMessagesDropdownOpen(!isMessagesDropdownOpen);
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Sidebar Toggle (Visible only on small screens) */}
        <button
          className="md:hidden p-2 rounded-full text-white bg-pink-500 hover:bg-pink-600 transition-colors"
          onClick={toggleSearchDropdown}
        >
          <i className="fa fa-bars"></i>
        </button>

        {/* Topbar Search (Hidden on small screens) */}
        <form className="hidden md:flex items-center bg-gray-100 rounded-lg overflow-hidden w-80">
          <input
            type="text"
            placeholder="Search for..."
            className="flex-1 px-3 py-2 text-gray-700 focus:outline-none bg-transparent"
          />
          <button
            className="px-4 py-2 bg-pink-500 text-white hover:bg-pink-600 transition-colors"
            type="button"
          >
            <i className="fas fa-search"></i>
          </button>
        </form>

        {/* Topbar Navbar */}
        <ul className="flex items-center space-x-4">
          {/* Nav Item - Search Dropdown (Visible only on small screens) */}
          <li className="md:hidden">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="searchDropdown"
              role="button"
              onClick={toggleSearchDropdown}
            >
              <i className="fas fa-search fa-fw"></i>
            </a>
            {/* Dropdown - Search */}
            <div
              className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 ${
                isSearchDropdownOpen ? "block" : "hidden"
              }`}
            >
              <form className="p-2">
                <input
                  type="text"
                  className="w-full px-2 py-1 border rounded"
                  placeholder="Search..."
                />
              </form>
            </div>
          </li>

          {/* Nav Item - Alerts */}
          <li className="relative">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="alertsDropdown"
              role="button"
              onClick={toggleAlertsDropdown}
            >
              <i className="fas fa-bell fa-fw"></i>
              <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
            </a>
            {/* Dropdown - Alerts */}
            <div
              className={`absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 ${
                isAlertsDropdownOpen ? "block" : "hidden"
              }`}
            >
              <div className="p-4">
                <h6 className="text-sm font-semibold">Alerts Center</h6>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <i className="fas fa-file-alt text-blue-500"></i>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">
                        New report available
                      </p>
                      <p className="text-xs text-gray-500">December 12, 2019</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>

          {/* Nav Item - Messages */}
          <li className="relative">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="messagesDropdown"
              role="button"
              onClick={toggleMessagesDropdown}
            >
              <i className="fas fa-envelope fa-fw"></i>
              <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
            </a>
            {/* Dropdown - Messages */}
            <div
              className={`absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 ${
                isMessagesDropdownOpen ? "block" : "hidden"
              }`}
            >
              <div className="p-4">
                <h6 className="text-sm font-semibold">Message Center</h6>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        className="h-8 w-8 rounded-full"
                        src="https://via.placeholder.com/150"
                        alt=""
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">Hi there!</p>
                      <p className="text-xs text-gray-500">Toni Fowler · 58m</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>

          {/* Nav Item - User Information */}
          <li className="relative">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="userDropdown"
              role="button"
              onClick={toggleUserDropdown}
            >
              <span className="mr-2 hidden md:inline text-gray-600">
                Danielle
              </span>
              <img
                className="h-8 w-8 rounded-full"
                src="https://via.placeholder.com/150"
                alt="User"
              />
            </a>
            {/* Dropdown - User Information */}
            <div
              className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 ${
                isUserDropdownOpen ? "block" : "hidden"
              }`}
            >
              <div className="py-1">
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </a>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
