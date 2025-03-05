import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useTicketStore } from "../../../store/useTicketStore";
import { useWindowStore } from "../../../store/useWindowStore";

const Window = () => {
  const { setSelectedWindow } = useWindowStore();
  const { getAllTickets, allTickets, totalTickets } = useTicketStore();
  useEffect(() => {
    getAllTickets();
  }, []);

  return (
    <div>
      <div className="flex justify-center items-center dark:bg-gray-800 min-h-screen w-full p-4">
        <div className="flex flex-wrap justify-center">
          {allTickets?.windows.map((num) => (
            <NavLink
              key={num.id}
              to={`/department-dashboard/windows/table`}
              className="no-underline"
              onClick={() => setSelectedWindow(num.id)}
            >
              <Card number={num} />
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

const Card = ({ number }) => {
  return (
    <div className="relative cursor-pointer dark:text-white m-4">
      <span className="absolute top-0 left-0 w-full h-full mt-1 ml-1 bg-pink-500 rounded-lg dark:bg-gray-200"></span>
      <div className="relative p-6 bg-white dark:bg-gray-800 border-2 border-pink-500 dark:border-gray-300 rounded-lg hover:scale-105 transition duration-500">
        <div className="flex items-center flex-col">
          <h3 className="my-2 text-lg font-bold text-gray-800 dark:text-white">
            Window {number.window_number}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            - {number.service_type} -
          </p>

          <hr className="bg-gray-950 my-2  w-full" />
          <div className="text-gray-600 dark:text-gray-300">
            Tickets: {totalTickets}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Window;
