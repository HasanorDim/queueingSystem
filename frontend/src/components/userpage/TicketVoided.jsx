import React from "react";

const TicketVoided = () => {
  return (
    <div className="w-full p-4 text-white text-center rounded-lg shadow-md mt-4 transition-all duration-500 bg-red-500 animate-pulse">
      <h3 className="text-xl font-bold">❌ Ticket Voided</h3>
      <p className="text-sm">Unfortunately, your ticket has been voided.</p>
    </div>
  );
};

export default TicketVoided;
