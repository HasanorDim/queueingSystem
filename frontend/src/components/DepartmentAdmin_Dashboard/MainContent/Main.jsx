import React, { useEffect } from "react";
import { useTicketStore } from "../../../store/useTicketStore";
import SubMain from "./SubMain";

const Main = () => {
  const {
    isBreakTime,
    setBreakTime,
    setTotalTicketByDepartments,
    ticketCount,
  } = useTicketStore();

  useEffect(() => {
    setTotalTicketByDepartments();
  }, []);

  const toggleAllQueues = (event) => {
    event.preventDefault();
    setBreakTime(!isBreakTime);
  };

  return (
    <div className="px-4 pt-6">
      {/* Page Heading */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <button
          id="queueToggleBtn"
          className="inline-block px-5 py-3 text-white rounded shadow-lg text-base"
          style={{ backgroundColor: isBreakTime ? "#4CAF50" : "#ff3385" }}
          onClick={toggleAllQueues}
        >
          <span id="queueToggleText">
            {isBreakTime ? "Resume All Queues" : "Pause All Queues"}
          </span>
        </button>
      </div>

      {/* Content Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Pending Tickets"
          icon="fas fa-hourglass-half"
          value={ticketCount?.waiting || 0}
          iconColor="text-amber-500" // Changed to amber for pending/waiting
          fontColor="text-yellow-500"
        />
        <StatCard
          title="Completed Tickets"
          icon="fas fa-check-circle"
          value={ticketCount?.completed || 0}
          iconColor="text-green-500" // Kept green for success/completion
          fontColor="text-green-500"
        />
        <StatCard
          title="Missed Tickets"
          icon="fas fa-user-times"
          value={ticketCount?.void || 0}
          iconColor="text-red-500" // Kept red for warning/errors
          fontColor="text-red-500"
        />
      </div>
      <SubMain />
    </div>
  );
};

const StatCard = ({ title, icon, iconColor, fontColor, value }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-5 border-t-4 border-pink-500">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-full bg-blue-50 ${iconColor}`}>
          <i className={`${icon} text-2xlxl`}></i>
        </div>
        <div>
          <p className={`text-sm ${fontColor}`}>{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default Main;
