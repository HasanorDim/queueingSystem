import React, { useState } from "react";

const Main = () => {
  const [queuePaused, setQueuePaused] = useState(false);

  const toggleAllQueues = (event) => {
    event.preventDefault();
    setQueuePaused(!queuePaused);
  };

  return (
    <div className="p-6">
      {/* Page Heading */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <button
          id="queueToggleBtn"
          className="inline-block px-5 py-3 text-white rounded shadow-lg text-base"
          style={{ backgroundColor: queuePaused ? "#4CAF50" : "#ff3385" }}
          onClick={toggleAllQueues}
        >
          <span id="queueToggleText">
            {queuePaused ? "Resume All Queues" : "Pause All Queues"}
          </span>
        </button>
      </div>

      {/* Content Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Active Tickets"
          icon="fas fa-ticket-alt"
          borderColor="border-blue-500"
          fontColor="text-blue-500"
        />
        <StatCard
          title="Completed Tickets"
          icon="fas fa-check-circle"
          borderColor="border-green-500"
          fontColor="text-green-500"
        />
        <StatCard
          title="Expired Tickets"
          icon="fas fa-exclamation-circle"
          borderColor="border-red-500"
          fontColor="text-red-500"
        />
        <StatCard
          title="Pending Tickets"
          icon="fas fa-clock"
          borderColor="border-yellow-500"
          fontColor="text-yellow-500"
        />
      </div>
    </div>
  );
};

const StatCard = ({ title, icon, borderColor, fontColor }) => {
  return (
    <div
      className={`border-l-4 ${borderColor} shadow-lg bg-white rounded-xl p-6 flex items-center`}
    >
      <div className="flex-grow">
        <p
          className={`text-sm font-bold text-gray-500 uppercase ${fontColor} `}
        >
          {title}
        </p>
        <h2 className="text-3xl font-bold text-gray-800">0</h2>
      </div>
      <i className={`${icon} text-4xl text-gray-400 ml-4`}></i>
    </div>
  );
};

export default Main;
