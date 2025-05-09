import React, { useEffect, useState } from "react";
import { useTicketStore } from "../../store/useTicketStore";
import { useWindowStore } from "../../store/useWindowStore";
import YourTurnMessage from "./YourTurnMessage";
import { useAuthStore } from "../../store/useAuthStore";
import TicketVoided from "./TicketVoided";
import TicketTimer from "./TicketTimer";

const InQueue = () => {
  const { socket } = useAuthStore();
  const { ticket, remainingTime } = useTicketStore();
  const {
    setWindow,
    getTicketWindows,
    windowTicket,
    unsubscribeNewTicketWindows,
    subscribeNewTicketWindows,
  } = useWindowStore();
  const [queueData, setQueueData] = useState([]);

  useEffect(() => {
    subscribeNewTicketWindows();
    return () => unsubscribeNewTicketWindows();
  }, [socket]);

  useEffect(() => {
    if (ticket?.window_id) {
      setWindow(ticket.window_id);
      getTicketWindows();
    }
  }, [ticket]);

  useEffect(() => {
    if (Array.isArray(windowTicket)) {
      let displayedQueue = windowTicket.slice(0, 5);
      const isUserTicketInQueue = displayedQueue.some(
        (t) => t?.id === ticket?.id
      );
      const userTicket = windowTicket.find((t) => t?.window.id === ticket?.id);

      if (windowTicket.length > 5 && !isUserTicketInQueue && userTicket) {
        displayedQueue = [...displayedQueue, userTicket];
      }

      setQueueData(displayedQueue);
    }
  }, [windowTicket, ticket]);

  return (
    <div className="w-full max-w-md rounded-xl shadow-lg overflow-hidden bg-white">
      <div className="sticky top-0 z-10">
        <h2 className="text-lg sm:text-xl font-bold text-center bg-gradient-to-r from-pink-500 to-pink-400 text-white py-3 sm:py-4 px-6">
          In Queue
        </h2>
      </div>

      <div className="overflow-y-auto max-h-[400px] p-4 space-y-3">
        {ticket.status === "waiting" ? (
          ""
        ) : ticket.status === "In Progress" ? (
          <YourTurnMessage />
        ) : ticket.status === "On Hold" ? (
          <TicketTimer />
        ) : ticket.status === "void" ? (
          <TicketVoided />
        ) : (
          ""
        )}{" "}
        {/* Show message if it's the user's turn */}
        {queueData.length > 0 ? (
          queueData.map((window, index) => {
            const isUserTicket = window.window.id === ticket?.id;

            return (
              <div
                key={window.window.id + index}
                className={`flex flex-col sm:flex-row items-center sm:justify-between p-4 rounded-lg border shadow-sm transition hover:shadow-md ${
                  ticket.status === "void" && isUserTicket
                    ? "bg-gray-400 text-gray-200 line- line-through"
                    : isUserTicket
                    ? "bg-green-100 border-green-300 sticky bottom-0"
                    : "bg-white border-gray-200 hover:border-pink-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 flex items-center justify-center font-bold rounded-full shadow-md transition-all duration-500 ${
                      ticket.status === "void" && isUserTicket
                        ? "bg-gray-400 text-gray-200 line- line-through"
                        : isUserTicket
                        ? "bg-green-500 text-white"
                        : "bg-pink-500 text-white"
                    }`}
                  >
                    {window.window.ticket_number}
                  </div>
                  <div className="text-center sm:text-left">
                    <span
                      className={`font-medium block ${
                        isUserTicket ? "text-green-800" : "text-gray-800"
                      }`}
                    >
                      {window.users.firstname} {window.users.lastname}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 mt-3 sm:mt-0">
                  <span
                    className={`px-4 py-1 text-sm font-medium rounded-full ${
                      window.window.status === "In Progress"
                        ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                        : "bg-gray-100 text-gray-700 border border-gray-300"
                    }`}
                  >
                    {window.window.status}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <svg
              className="w-12 sm:w-16 h-12 sm:h-16 text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <p className="text-lg sm:text-xl font-medium text-gray-500">
              Your dont have tickets in queue
            </p>
            <p className="text-sm text-gray-400 mt-1">
              When tickets arrive, they will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InQueue;
