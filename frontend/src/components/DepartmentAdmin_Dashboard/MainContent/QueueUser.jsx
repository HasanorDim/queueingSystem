import React, { useEffect, useState } from "react";
import { useTicketStore } from "../../../store/useTicketStore";
import { useWindowStore } from "../../../store/useWindowStore";
import { Navigate } from "react-router-dom";

const QueueUser = () => {
  const {
    getAllTickets,
    updateTicketStatus,
    isTicketUpdate,
    allTickets,
    nextWindowForUser,
    setTicketNotPresent,
    isStatusUpdated,
    subsToUpdateStatus,
    unsubsubsToUpdateStatus,
  } = useTicketStore();
  const {
    windowId,
    getWindowDetails,
    getTicketWindows,
    windowTicket,
    dataInProgress,
    getTicketInQueueWindow,
    windowTicketInQueue,
  } = useWindowStore();

  const [proceedData, setProceedData] = useState("");
  const [selectedWindow, setSelectedWindow] = useState(""); // State to store the selected window
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  useEffect(() => {
    if (!windowId) return;

    getAllTickets();
    getWindowDetails();
    getTicketInQueueWindow();
  }, [windowId, isTicketUpdate, isStatusUpdated]);

  useEffect(() => {
    subsToUpdateStatus();
    return () => unsubsubsToUpdateStatus();
  }, []);

  const handleTicketStatus = async (ticketId, status) => {
    updateTicketStatus(ticketId, status);
  };

  const handleProceedToWindow = async (ticketId) => {
    if (!selectedWindow) {
      alert("Please select a window to proceed.");
      return;
    }

    try {
      const parsedData = JSON.parse(selectedWindow);
      nextWindowForUser(parsedData);
      updateTicketStatus(ticketId, "completed");
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  };

  const handleMarkNotPresent = async (ticketId, status) => {
    setTicketNotPresent({ ticketId, status });
  };
  if (!windowId) {
    return <Navigate to="/department-dashboard/windows" />;
  }

  return (
    <div className="flex flex-col justify-center p-8 gap-8 md:flex-row min-h-[500px]">
      {/* Queue Users Card */}
      <div className="rounded-xl shadow-lg w-full max-w-md overflow-hidden">
        <div className="sticky top-0 z-10">
          <h2 className="bg-gradient-to-r text-center text-white text-xl font-bold from-pink-500 px-6 py-4 to-pink-400">
            In Queue
          </h2>
        </div>

        <div className="bg-white p-4 max-h-[400px] overflow-y-auto space-y-3">
          {windowTicketInQueue?.length > 0 ? (
            windowTicketInQueue.map((ticket, index) => (
              <div
                key={ticket.window.id}
                className="flex bg-white border border-gray-100 justify-between p-4 rounded-lg shadow-sm hover:border-pink-200 hover:shadow-md items-center overflow-hidden relative transition"
                onClick={() =>
                  setSelectedTicketId((prev) =>
                    prev === ticket.window.id ? null : ticket.window.id
                  )
                }
              >
                <div className="flex gap-3 items-center">
                  <div className="flex bg-pink-500 h-10 justify-center rounded-full shadow-md text-white w-10 font-bold items-center">
                    {ticket.window.ticket_number}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-800 font-medium">
                      {ticket.users.firstname} {ticket.users.lastname}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <span
                    className={`px-4 py-1 text-sm font-medium rounded-full ${
                      ticket.window.status === "In Progress"
                        ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                        : "bg-gray-100 text-gray-700 border border-gray-200"
                    }`}
                  >
                    {ticket.window.status}
                  </span>
                  {index === 0 && ticket.window.status !== "In Progress" && (
                    <button
                      className="bg-blue-500 rounded text-white hover:bg-blue-600 px-3 py-1 transition-colors"
                      onClick={() =>
                        handleTicketStatus(ticket.window.id, "In Progress")
                      }
                    >
                      Next
                    </button>
                  )}

                  {index === 0 && ticket.window.status === "In Progress" && (
                    <button
                      className={`absolute w-52 h-32 bg-red-500 text-white px-4 py-2 transition-all duration-500 ease-in-out hover:bg-red-600 hover:scale-105 flex items-center justify-center gap-1 right-0 
                    ${
                      selectedTicketId === ticket.window.id
                        ? "translate-x-0 opacity-100"
                        : "translate-x-full opacity-0"
                    }`}
                      onClick={() =>
                        handleMarkNotPresent(ticket.window.id, "On Hold")
                      }
                    >
                      <img className="w-7" src="/absence-white.svg" alt="" />
                      Mark as Not Present
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col justify-center text-center items-center py-12">
              <svg
                className="h-16 text-gray-300 w-16 mb-4"
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
              <p className="text-gray-500 text-xl font-medium">
                No tickets in queue
              </p>
              <p className="text-gray-400 text-sm mt-1">
                When tickets arrive, they will appear here
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Currently Serving Card */}
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md md:mt-0 mt-8 overflow-hidden">
        <div className="sticky top-0 z-10">
          <h2 className="bg-gradient-to-r text-center text-white text-xl font-bold from-green-500 px-6 py-4 to-green-400">
            Currently Serving
          </h2>
        </div>

        <div className="h-full p-4 max-h-[400px] overflow-y-auto relative space-y-3">
          {!dataInProgress || dataInProgress.length > 0 ? (
            dataInProgress?.map((y) => (
              <div
                key={y.users.id}
                className="flex flex-col bg-white border border-gray-100 h-full justify-between p-4 rounded-lg shadow-sm hover:border-green-200 hover:shadow-md items-center transition"
              >
                <div className="flex flex-col justify-center gap-3 items-center">
                  <div className="relative">
                    <div className="flex border-4 border-pink-600 h-32 justify-center rounded-full w-32 items-center overflow-hidden relative">
                      <img
                        className="h-full rounded-full w-full"
                        src="/defaultimge.jpg"
                        alt="User Profile"
                      />
                    </div>
                    <div className="flex bg-green-500 h-8 justify-center rounded-full shadow-md text-white w-8 -right-3 absolute font-bold items-center md:h-10 md:w-10 top-0">
                      {y.window.ticket_number}
                    </div>
                  </div>

                  <div className="flex flex-col justify-center">
                    <span className="text-center text-gray-800 font-medium">
                      {y.users.firstname} {y.users.lastname}
                    </span>
                    <span
                      className={`px-4 py-1 text-sm font-medium rounded-full ${
                        y.window?.status === "In Progress"
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : "bg-gray-100 text-gray-700 border border-gray-200"
                      }`}
                    >
                      {y.window.status}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col w-full gap-2 mt-4">
                  {/* Mark as Complete Button */}
                  <button
                    className="flex bg-green-500 justify-center rounded text-white w-full gap-2 hover:bg-green-600 items-center px-4 py-2 transition-colors"
                    onClick={() => handleTicketStatus(y.window.id, "completed")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Mark as Complete
                  </button>

                  {/* Proceed to Another Window */}
                  <div className="flex flex-col gap-2">
                    <select
                      className="bg-white border border-gray-300 rounded text-gray-700 w-full hover:border-gray-400 px-4 py-2 transition-colors"
                      onChange={(e) => setSelectedWindow(e.target.value)}
                    >
                      <option value="" disabled selected>
                        Select a Window
                      </option>
                      {allTickets?.windows.map((x) => (
                        <option
                          key={x.id}
                          value={JSON.stringify({ window: x, user: y.users })}
                          disabled={x.id === windowId}
                        >
                          {x.service_type}
                        </option>
                      ))}
                    </select>
                    <button
                      className="flex bg-blue-500 justify-center rounded text-white w-full gap-2 hover:bg-blue-600 items-center px-4 py-2 transition-colors"
                      onClick={() => handleProceedToWindow(y.window.id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Proceed to Selected Window
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col justify-center text-center items-center py-12">
              <svg
                className="h-16 text-gray-300 w-16 mb-4"
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
              <p className="text-gray-500 text-xl font-medium">
                No active tickets
              </p>
              <p className="text-gray-400 text-sm mt-1">
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
