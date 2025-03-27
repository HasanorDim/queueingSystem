import React from "react";
import { useTicketStore } from "../../store/useTicketStore";

const TicketTimer = () => {
  const { remainingTime } = useTicketStore();

  return (
    <div className="w-full p-5 text-white text-center rounded-xl shadow-lg mt-4 transition-all duration-500 bg-gradient-to-r from-red-600 to-red-500 animate-pulse">
      <h3 className="text-2xl font-bold tracking-wide flex items-center justify-center gap-2">
        ⏳ Ticket Timer
      </h3>
      <p className="text-4xl font-extrabold mt-2">{remainingTime}s</p>
      <p className="text-sm text-white/80 mt-1">Time left before voiding</p>
    </div>
  );
};

export default TicketTimer;
