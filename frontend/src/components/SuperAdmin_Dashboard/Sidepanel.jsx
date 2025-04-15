import {
  Building2,
  CalendarDays,
  ChevronUp,
  LayoutDashboard,
  LetterText,
  TableProperties,
} from "lucide-react";
import React, { useState } from "react";
import SidePanelHeadText from "../text/SidePanelHeadText";
import { NavLink } from "react-router-dom";

const Sidepanel = () => {
  const authUser = { role: 1 };

  // State to handle toggling of menu sections
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isFormsOpen, setIsFormsOpen] = useState(false);
  const [isTablesOpen, setIsTablesOpen] = useState(false);

  // Toggle functions for each section
  const toggleDashboard = () => setIsDashboardOpen(!isDashboardOpen);
  const toggleForms = () => setIsFormsOpen(!isFormsOpen);
  const toggleTables = () => setIsTablesOpen(!isTablesOpen);
  // rgb(28 36 52 / var(--tw-bg-opacity));

  return (
    <>
      <aside className="absolute left-0 top-0 z-50 flex h-screen w-64 flex-col overflow-y-auto bg-[#1c2434] text-white duration-300 ease-linear lg:static lg:translate-x-0 -translate-x-full">
        {/* Header Section */}
        <div className="flex items-center justify-between gap-2 px-6 py-5 lg:py-6">
          <a aria-current="page" className="active" href="/">
            <SidePanelHeadText
              textHead={
                authUser.role === 1 ? "Super Admin" : "Department Admin"
              }
            />
          </a>
          <button
            aria-controls="sidebar"
            aria-expanded="false"
            className="block lg:hidden"
          >
            <svg
              className="fill-current"
              width="20"
              height="18"
              viewBox="0 0 20 18"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
                fill=""
              />
            </svg>
          </button>
        </div>

        {/* Menu Section */}
        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
            <div>
              <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
                MENU
              </h3>
              <ul className="mb-6 flex flex-col gap-1.5">
                {/* Dashboard Link */}
                <li>
                  {/* <a
                    onClick={toggleDashboard}
                    className="group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 bg-graydark dark:bg-meta-4 active cursor-pointer"
                  >
                    <LayoutDashboard />
                    Dashboard
                    <ChevronUp
                      className={`absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 ${
                        isDashboardOpen ? "rotate-180" : ""
                      }`}
                    />
                  </a> */}

                  <NavLink
                    to="/dashboard"
                    end
                    className={({ isActive }) =>
                      `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                        isActive ? "bg-gray-600" : ""
                      }`
                    }
                  >
                    <LayoutDashboard />
                    Dashboard
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/dashboard/organization-units"
                    className={({ isActive }) =>
                      `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                        isActive ? "bg-gray-600" : ""
                      }`
                    }
                  >
                    <Building2 />
                    Department
                  </NavLink>
                </li>

                {/* Forms Link (For Super Admin) */}
                {authUser.role === 1 && (
                  <li>
                    <a
                      onClick={toggleForms}
                      className="group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 active cursor-pointer"
                    >
                      <LetterText />
                      Forms
                      <ChevronUp
                        className={`absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 ${
                          isFormsOpen ? "rotate-180" : ""
                        }`}
                      />
                    </a>
                    <div
                      className={`translate transform overflow-hidden ${
                        isFormsOpen ? "block" : "hidden"
                      }`}
                    >
                      <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                        <li>
                          <a
                            className="group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white"
                            href="/forms/form-elements"
                          >
                            Form Elements
                          </a>
                        </li>
                        <li>
                          <a
                            className="group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white"
                            href="/forms/pro-form-elements"
                          >
                            Pro Form Elements
                            <span className="absolute right-4 block rounded bg-primary py-1 px-2 text-xs font-medium text-white">
                              Pro
                            </span>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidepanel;
