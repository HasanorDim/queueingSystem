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
    if (!windowId) return;
    getTicketWindows();
  }, [windowTicketInQueue]);

  useEffect(() => {
    subsToUpdateStatus();
    return () => unsubsubsToUpdateStatus();
  }, []);

  const handleTicketStatus = async (ticketId, status) => {
    updateTicketStatus(ticketId, status);
  };

  // const handleProceedToWindow = async (ticketId) => {
  //   if (!selectedWindow) {
  //     alert("Please select a window to proceed.");
  //     return;
  //   }

  //   try {
  //     const parsedData = JSON.parse(selectedWindow);
  //     nextWindowForUser(parsedData);
  //     updateTicketStatus(ticketId, "completed");
  //   } catch (error) {
  //     console.error("Error parsing JSON:", error);
  //   }
  // };

  const handleMarkNotPresent = async (ticketId, status) => {
    setTicketNotPresent({ ticketId, status });
  };
  if (!windowId) {
    return <Navigate to="/department-dashboard/windows" />;
  }

  return (
    <div className="min-h-screen bg-pink-50 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Queue Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-pink-100">
          <div className="bg-gradient-to-r from-pink-500 to-pink-400 p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">In Queue</h2>
              <span className="bg-white text-pink-600 px-3 py-1 rounded-full text-sm font-medium">
                {windowTicketInQueue?.length || 0} waiting
              </span>
            </div>
          </div>

          <div className="p-4 max-h-[500px] overflow-y-auto">
            {windowTicketInQueue?.length > 0 ? (
              <div className="space-y-3">
                {windowTicketInQueue.map((ticket, index) => (
                  <div
                    key={ticket.window.id}
                    className={`relative p-4 rounded-xl transition-all duration-200 overflow-hidden ${
                      index === 0
                        ? "bg-pink-50 border-2 border-pink-300"
                        : "bg-white border border-pink-100"
                    }`}
                    onClick={() =>
                      setSelectedTicketId((prev) =>
                        prev === ticket.window.id ? null : ticket.window.id
                      )
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-pink-500 text-white font-bold rounded-full h-10 w-10 flex items-center justify-center">
                          {ticket.window.ticket_number}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {ticket.users.firstname} {ticket.users.lastname}
                          </p>
                          <p className="text-sm text-gray-500">
                            {ticket.users.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            ticket.window.status === "In Progress"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {ticket.window.status}
                        </span>

                        {index === 0 &&
                          ticket.window.status !== "In Progress" && (
                            <button
                              onClick={() =>
                                handleTicketStatus(
                                  ticket.window.id,
                                  "In Progress"
                                )
                              }
                              className="bg-pink-600 hover:bg-pink-700 text-white px-3 py-1 rounded-lg text-sm"
                            >
                              Next
                            </button>
                          )}
                      </div>
                    </div>

                    {/* Mark as Not Present Button - Preserved Feature */}
                    {index === 0 && ticket.window.status === "In Progress" && (
                      <button
                        className={`absolute right-4 top-1/2 transform -translate-y-1/2 bg-red-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 ${
                          selectedTicketId === ticket.window.id
                            ? "translate-x-0 opacity-100"
                            : "translate-x-full opacity-0"
                        } hover:bg-red-600`}
                        onClick={() =>
                          handleMarkNotPresent(ticket.window.id, "On Hold")
                        }
                      >
                        <img
                          className="w-5"
                          src="/absence-white.svg"
                          alt="Not Present"
                        />
                        <span>Mark as Not Present</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-pink-100 rounded-full p-4 mb-4">
                  <svg
                    className="h-12 w-12 text-pink-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-700">
                  No tickets in queue
                </h3>
                <p className="text-gray-500 mt-1">
                  When tickets arrive, they will appear here
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Currently Serving Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-pink-100">
          <div className="bg-gradient-to-r from-green-500 to-green-400 p-4">
            <h2 className="text-xl font-bold text-white">Currently Serving</h2>
          </div>

          <div className="p-4">
            {dataInProgress?.length > 0 ? (
              <div className="space-y-6">
                {dataInProgress.map((y) => (
                  <div
                    key={y.users.id}
                    className="p-6 bg-white rounded-xl border border-pink-100"
                  >
                    <div className="flex flex-col items-center">
                      {/* User Avatar */}
                      <div className="relative mb-4">
                        <div className="h-24 w-24 rounded-full border-4 border-pink-300 overflow-hidden">
                          <img
                            src="/defaultimge.jpg"
                            alt="User"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-pink-500 text-white rounded-full h-8 w-8 flex items-center justify-center font-bold">
                          {y.window.ticket_number}
                        </div>
                      </div>

                      {/* User Info */}
                      <div className="text-center mb-6">
                        <h3 className="text-lg font-bold text-gray-800">
                          {y.users.firstname} {y.users.lastname}
                        </h3>
                        <span
                          className={`px-3 py-1 mt-2 inline-block rounded-full text-sm font-medium ${
                            y.window.status === "In Progress"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {y.window.status}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="w-full space-y-3">
                        <button
                          onClick={() =>
                            handleTicketStatus(y.window.id, "completed")
                          }
                          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition"
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span>Mark as Complete</span>
                        </button>

                        <div className="space-y-2">
                          <select
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-pink-500 focus:ring-pink-500"
                            onChange={(e) => setSelectedWindow(e.target.value)}
                          >
                            <option value="" disabled selected>
                              Select a Window
                            </option>
                            {allTickets?.windows.map((x) => (
                              <option
                                key={x.id}
                                value={JSON.stringify({
                                  window: x,
                                  user: y.users,
                                })}
                                disabled={x.id === windowId}
                              >
                                {x.service_type}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleProceedToWindow(y.window.id)}
                            className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition"
                          >
                            <svg
                              className="h-5 w-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                              />
                            </svg>
                            <span>Proceed to Window</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-green-100 rounded-full p-4 mb-4">
                  <svg
                    className="h-12 w-12 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-700">
                  No active tickets
                </h3>
                <p className="text-gray-500 mt-1">
                  Currently not serving any tickets
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueueUser;
