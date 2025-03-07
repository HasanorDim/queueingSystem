import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useTicketStore } from "../../../store/useTicketStore";
import { useWindowStore } from "../../../store/useWindowStore";
import { Pencil, Plus } from "lucide-react";
import Department from "../modal/Department";
import DeleteModal from "../modal/DeleteModal";

const Window = () => {
  const { setSelectedWindow, isWindowUpdate } = useWindowStore();
  const { getAllTickets, allTickets, groupWindows } = useTicketStore();
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    getAllTickets();
  }, [isWindowUpdate]);

  return (
    <div className="p-6 dark:bg-gray-900 min-h-screen">
      {/* Header and Add Button */}
      <div className="flex justify-end">
        <button
          className="flex items-center gap-2 bg-pink-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-pink-700 transition"
          onClick={() => {
            document.getElementById("Modal_Window").showModal();
            setEdit(false);
          }}
        >
          <Plus size={20} /> Add Window
        </button>
      </div>

      {/* Windows Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {allTickets?.windows.map((window) => (
          <div
            key={window.id}
            className="relative p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
          >
            <NavLink
              to={`/department-dashboard/windows/table`}
              className="block"
            >
              <Card number={window} groupWindows={groupWindows} />
            </NavLink>

            <button
              className="absolute top-2 right-2 p-2 rounded-full bg-pink-500 text-white hover:bg-pink-700 transition"
              onClick={() => {
                document.getElementById("Modal_Window").showModal();
                setSelectedWindow(window);
                setEdit(true);
              }}
            >
              <Pencil size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const Card = ({ number, groupWindows }) => {
  return (
    <div className="relative cursor-pointer dark:text-white m-4">
      <span className="absolute top-0 left-0 w-full h-full mt-1 ml-1 bg-pink-500 rounded-lg dark:bg-gray-200 "></span>
      <div className="relative p-6 bg-white dark:bg-gray-800 border-2 border-pink-500 dark:border-gray-300 rounded-lg hover:scale-105 transition duration-500">
        <div className="flex items-center flex-col ">
          <h3 className="my-2 text-lg font-bold text-gray-800 dark:text-white">
            Window {number.window_number}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            - {number.service_type} -
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            - {number.staff_name || ""} -
          </p>

          <hr className="bg-gray-950 my-2  w-full" />
          <div className="text-gray-600 dark:text-gray-300">
            Tickets: {groupWindows[number.id]?.length || 0}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Window;
