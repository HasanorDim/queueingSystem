import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useTicketStore } from "../../../store/useTicketStore";
import { useWindowStore } from "../../../store/useWindowStore";

const Window = () => {
  const { isWindowUpdate, setSelectedWindow } = useWindowStore();
  const { getAllTickets, allTickets, groupWindows } = useTicketStore();

  useEffect(() => {
    getAllTickets();
  }, [isWindowUpdate]);

  return (
    <div>
      <div className="flex justify-center items-center dark:bg-gray-800 min-h-full w-full p-4">
        <div className="flex flex-wrap justify-center gap-10">
          {allTickets?.windows.map((num) => (
            <NavLink
              key={num.id}
              to="/department-dashboard/window-table"
              className="no-underline"
              onClick={() => setSelectedWindow(num)}
            >
              <Card number={num} groupWindows={groupWindows} />
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

const Card = ({ number, groupWindows }) => {
  return (
    <div className="bg-pink-50 rounded-xl p-16 border border-pink-300 transition hover:shadow-2xl">
      <h3 className="text-2xl font-bold text-pink-800 mb-2">
        Counter #{number.window_number}
      </h3>
      <h2 className="text-xl font-bold text-pink-800 mb-4">
        {number.service_type}
      </h2>
      <p className="text-pink-700 mt-1">
        🎟 Tickets:{" "}
        <span className="font-bold">
          {groupWindows[number.id]?.length || 0}
        </span>
      </p>
      <p className="text-pink-700 mt-1">
        👨‍💼 Staff:{" "}
        <span className="font-medium text-pink-900">
          {number.staff_name ?? "Not Assigned"}
        </span>
      </p>
    </div>
  );
};

export default Window;
