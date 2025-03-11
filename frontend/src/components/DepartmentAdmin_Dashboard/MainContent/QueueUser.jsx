import React, { useEffect, useState } from "react";
import { useTicketStore } from "../../../store/useTicketStore";
import { useWindowStore } from "../../../store/useWindowStore";
import { Navigate } from "react-router-dom";

const QueueUser = () => {
  const { getAllTickets } = useTicketStore();
  const {
    windowId,
    selectedWindow,
    getWindowDetails,
    getTicketWindows,
    windowTicket,
    updateTicketStatus,
    moveTicketToWindow,
  } = useWindowStore();

  const [selectedTicket, setSelectedTicket] = useState({
    window: {
      id: 1,
      ticket_number: "A001",
      status: "In Progress",
    },
    users: {
      firstname: "John",
      lastname: "Doe",
    },
  });

  useEffect(() => {
    if (windowId) {
      getAllTickets();
      getWindowDetails();
      getTicketWindows();
    }
  }, [windowId]);

  const handleCompleteTicket = async (ticketId) => {
    await (ticketId, "Completed");
    await getAllTickets(); // Refresh the ticket list
  };

  const handleServiceCompleted = async (ticketId) => {
    await updateTicketStatus(ticketId, "Service Completed");
    await getAllTickets(); // Refresh the ticket list
  };

  const handleMoveTicket = async (ticketId, newWindowId) => {
    await moveTicketToWindow(ticketId, newWindowId);
    await getAllTickets(); // Refresh the ticket list
  };

  if (!windowId) {
    return <Navigate to="/department-dashboard/windows" />;
  }

  return (
    <div className="flex flex-col md:flex-row justify-center gap-8 p-8 min-h-[500px] ">
      {/* Queue Users Card */}
      <div className="w-full max-w-md rounded-xl shadow-lg overflow-hidden">
        <div className="sticky top-0 z-10">
          <h2 className="text-xl font-bold text-center bg-gradient-to-r from-pink-500 to-pink-400 text-white py-4 px-6">
            In Queue
          </h2>
        </div>

        <div className="overflow-y-auto max-h-[400px] p-4 space-y-3 bg-white">
          {windowTicket?.length > 0 ? (
            windowTicket.map((ticket) => (
              <div
                key={ticket.window.id}
                className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-100 shadow-sm transition hover:shadow-md hover:border-pink-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center bg-pink-500 text-white font-bold rounded-full shadow-md">
                    {ticket.window.ticket_number}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800">
                      {ticket.users.firstname} {ticket.users.lastname}
                    </span>
                  </div>
                </div>
                <span
                  className={`px-4 py-1 text-sm font-medium rounded-full ${
                    ticket.window.status === "In Progress"
                      ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                      : "bg-gray-100 text-gray-700 border border-gray-200"
                  }`}
                >
                  {ticket.window.status}
                </span>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <svg
                className="w-16 h-16 text-gray-300 mb-4"
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
              <p className="text-xl font-medium text-gray-500">
                No tickets in queue
              </p>
              <p className="text-sm text-gray-400 mt-1">
                When tickets arrive, they will appear here
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Currently Serving Card */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden mt-8 md:mt-0">
        <div className="sticky top-0 z-10">
          <h2 className="text-xl font-bold text-center bg-gradient-to-r from-green-500 to-green-400 text-white py-4 px-6">
            Currently Serving
          </h2>
        </div>

        <div className="relative overflow-y-auto max-h-[400px] p-4 space-y-3 h-full">
          {selectedTicket ? (
            <div className="flex flex-col items-center bg-white p-4 rounded-lg border border-gray-100 shadow-sm transition hover:shadow-md hover:border-green-200 h-full justify-between">
              <div className="flex items-center gap-3 flex-col justify-center">
                <div className="relative">
                  <div className="rounded-full border-4 border-pink-600 relative w-32 h-32 flex items-center justify-center overflow-hidden">
                    <img
                      className="w-full h-full rounded-full"
                      src="/defaultimge.jpg"
                      alt="User Profile"
                    />
                  </div>
                  <div className="absolute top-0 -right-3 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-green-500 text-white font-bold rounded-full shadow-md">
                    {selectedTicket.window.ticket_number}
                  </div>
                </div>

                <div className="flex flex-col justify-center ">
                  <span className="font-medium text-gray-800 text-center">
                    {selectedTicket.users.firstname}{" "}
                    {selectedTicket.users.lastname}
                  </span>
                  <span
                    className={`px-4 py-1 text-sm font-medium rounded-full ${
                      selectedTicket.window.status === "In Progress"
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : "bg-gray-100 text-gray-700 border border-gray-200"
                    }`}
                  >
                    {selectedTicket.window.status}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4 ">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                  onClick={() => handleCompleteTicket(selectedTicket.window.id)}
                >
                  Mark as Complete
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                  onClick={() =>
                    handleServiceCompleted(selectedTicket.window.id)
                  }
                >
                  Proceed to
                </button>
                <select
                  className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded hover:border-gray-400 transition-colors"
                  onChange={(e) =>
                    handleMoveTicket(selectedTicket.window.id, e.target.value)
                  }
                >
                  <option value="">Move to Window</option>
                  <option value="1">Window 1</option>
                  <option value="2">Window 2</option>
                  <option value="3">Window 3</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <svg
                className="w-16 h-16 text-gray-300 mb-4"
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
              <p className="text-xl font-medium text-gray-500">
                No active tickets
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Currently not serving any tickets
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QueueUser;
