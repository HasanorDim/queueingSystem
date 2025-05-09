import React, { useEffect, useState } from "react";
import { useTicketStore } from "../../../store/useTicketStore";
import { useWindowStore } from "../../../store/useWindowStore";
import { Navigate } from "react-router-dom";

const QueueUser = () => {
  // isLoading
  // <button
  //   type="submit"
  //   className="btn btn-primary w-full"
  //   disabled={isLogingIn}
  // >
  //   {isLogingIn ? (
  //     <>
  //       <Loader2 className="h-5 w-5 animate-spin" />
  //       Loading...
  //     </>
  //   ) : (
  //     "Sign in"
  //   )}
  // </button>
  const {
    getAllTickets,
    updateTicketStatus,
    isTicketUpdate,
    allTickets,
    nextWindowForUser,
  } = useTicketStore();
  const {
    windowId,
    getWindowDetails,
    getTicketWindows,
    windowTicket,
    dataInProgress,
  } = useWindowStore();

  const [proceedData, setProceedData] = useState("");
  const [selectedWindow, setSelectedWindow] = useState(""); // State to store the selected window
  const [markNotPresentData, setmarkNotPresentData] = useState(false);

  useEffect(() => {
    if (windowId) {
      getAllTickets();
      getWindowDetails();
      getTicketWindows();
    }
  }, [windowId, isTicketUpdate]);

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
      updateTicketStatus(ticketId, "proceeded");
      console.log("Ticket Updated:", ticketId, "Status: proceeded");
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  };

  if (!windowId) {
    return <Navigate to="/department-dashboard/windows" />;
  }




  
  console.log("sorted: ", sorted);

  // Filter and categorize tickets by priority, converting 'none' to 'standard'
  const filteredTickets = sorted.reduce((acc, item) => {
    const priority =
      item.window.priority === "none"
        ? "standard"
        : item.window.priority || "standard";

    if (!acc[priority]) {
      acc[priority] = [];
    }

    acc[priority].push(item.window);
    return acc;
  }, {});

  // Create the categorized object
  const categorizedTickets = {
    pwd: filteredTickets.pwd || [],
    pregnant: filteredTickets.pregnant || [],
    senior: filteredTickets.senior || [],
    standard: filteredTickets.standard || [], // Now includes both null/undefined and 'none' priorities
    all: sorted,
  };

  console.log("Categorized tickets: ", categorizedTickets);

  set({ windowFilteredPriority: categorizedTickets });


  
  return (
    <div className="flex flex-col md:flex-row justify-center gap-8 p-8 min-h-[500px]">
      {/* Queue Users Card */}
      <div className="w-full max-w-md rounded-xl shadow-lg overflow-hidden">
        <div className="sticky top-0 z-10">
          <h2 className="text-xl font-bold text-center bg-gradient-to-r from-pink-500 to-pink-400 text-white py-4 px-6">
            In Queue
          </h2>
        </div>

        <div className="overflow-y-auto max-h-[400px] p-4 space-y-3 bg-white">
          {windowTicket?.length > 0 ? (
            windowTicket.map((ticket, index) => (
              <div
                key={ticket.window.id}
                className="overflow-hidden relative flex items-center justify-between bg-white p-4 rounded-lg border border-gray-100 shadow-sm transition hover:shadow-md hover:border-pink-200"
                onClick={() => setmarkNotPresentData((prev) => !prev)}
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
                <div className="flex items-center gap-2">
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
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                      onClick={() =>
                        handleTicketStatus(ticket.window.id, "In Progress")
                      }
                    >
                      Next
                    </button>
                  )}

                  {index === 0 &&
                    ticket.window.status === "In Progress" &&
                    (markNotPresentData ? (
                      <button
                        className="absolute w-64 h-32 clip-trapezoid-left bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors flex items-center justify-center gap-2 right-0 ease-in "
                        onClick={() => handleTicketStatus(y.window.id, "void")}
                      >
                        <img className="w-7" src="/absence-white.svg" alt="" />
                        Mark as Not Present
                      </button>
                    ) : (
                      ""
                    ))}
                </div>
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
          {!dataInProgress || dataInProgress.length > 0 ? (
            dataInProgress?.map((y) => (
              <div
                key={y.users.id}
                className="flex flex-col items-center bg-white p-4 rounded-lg border border-gray-100 shadow-sm transition hover:shadow-md hover:border-green-200 h-full justify-between"
              >
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
                      {y.window.ticket_number}
                    </div>
                  </div>

                  <div className="flex flex-col justify-center ">
                    <span className="font-medium text-gray-800 text-center">
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
                <div className="flex flex-col gap-2 mt-4 w-full">
                  {/* Mark as Complete Button */}
                  <button
                    className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
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
                      className="w-full bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded hover:border-gray-400 transition-colors"
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
                          Window {x.window_number}
                        </option>
                      ))}
                    </select>
                    <button
                      className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
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

// Sample
// Sample
// Sample
// Sample
// Sample
// Sample
// Sample
// Sample

import React, { useEffect, useState } from "react";
import { useTicketStore } from "../../../store/useTicketStore";
import { useWindowStore } from "../../../store/useWindowStore";
import { Navigate } from "react-router-dom";
import { FaBaby, FaUserAlt, FaWheelchair, FaFilter } from "react-icons/fa";
import toast from "react-hot-toast";

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
  const [selectedWindow, setSelectedWindow] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [isPriorityModalOpen, setIsPriorityModalOpen] = useState(false);
  const [priorityType, setPriorityType] = useState(null);
  const [ticketIdState, setTicketIdState] = useState(null);
  const [activeFilter, setActiveFilter] = useState("none");
  const [showFilters, setShowFilters] = useState(false);

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
  }, [isTicketUpdate]);

  if (!windowId) {
    return <Navigate to="/department-dashboard/windows" />;
  }

  const handleTicketStatus = async (ticketId, status) => {
    updateTicketStatus(ticketId, status);
  };

  const handleProceedToWindow = async (ticketId) => {
    if (!selectedWindow) {
      toast.error("Please select a window to proceed.");
      return;
    }
    try {
      setTicketIdState(ticketId);
      setIsPriorityModalOpen(true);
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  };

  const confirmWithPriority = async () => {
    try {
      const parsedData = JSON.parse(selectedWindow);
      const finalData = {
        ...parsedData,
        priority: priorityType,
      };
      nextWindowForUser(finalData);
      updateTicketStatus(ticketIdState, "completed");
      setIsPriorityModalOpen(false);
    } catch (error) {
      console.error("Error adding ticket:", error);
      toast.error("Failed to add ticket. Please try again.");
    }
  };

  const handleMarkNotPresent = async (ticketId, status) => {
    setTicketNotPresent({ ticketId, status });
  };

  const filteredTickets = {
    [activeFilter]: windowTicketInQueue?.filter((ticket) => {
      if (activeFilter === ticket.window.priority) {
        return ticket;
      }
      return ticket.window.priority === activeFilter;
    }),
  };

  const priorityFilters = [
    { id: "none", label: "Standard", color: "gray" },
    { id: "pwd", label: "PWD", color: "red" },
    { id: "pregnant", label: "Pregnant", color: "orange" },
    { id: "senior", label: "Senior", color: "blue" },
  ];

  return (
    <div className="min-h-screen bg-pink-50 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Queue Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-pink-100">
          <div className="bg-gradient-to-r from-pink-500 to-pink-400 p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-bold text-white">In Queue</h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition"
                >
                  <FaFilter className="text-white" />
                </button>
              </div>
              <span className="bg-white text-pink-600 px-3 py-1 rounded-full text-sm font-medium">
                {windowTicketInQueue?.length || 0} waiting
              </span>
            </div>

            {/* Priority Filters */}
            {showFilters && (
              <div className="mt-3 flex flex-wrap gap-2">
                {priorityFilters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      activeFilter === filter.id
                        ? `bg-${filter.color}-100 text-${filter.color}-800 border-${filter.color}-500 border`
                        : `bg-white text-gray-700 hover:bg-gray-100`
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 max-h-[500px] overflow-y-auto">
            {filteredTickets?.[activeFilter]?.length > 0 ? (
              <div className="space-y-3">
                {filteredTickets?.[activeFilter]?.map((ticket, index) => (
                  <div
                    key={ticket.window.id}
                    className={`relative p-4 rounded-xl transition-all duration-200 overflow-hidden ${
                      index === 0
                        ? "bg-pink-50 border-2 border-pink-300"
                        : "bg-white border border-pink-100"
                    } ${
                      ticket.window.priority === "pwd"
                        ? "ring-2 ring-red-500"
                        : ticket.window.priority === "pregnant"
                        ? "ring-2 ring-orange-500"
                        : ticket.window.priority === "senior"
                        ? "ring-2 ring-blue-500"
                        : ""
                    }`}
                  >
                    {ticket.window.priority && (
                      <div
                        className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold ${
                          ticket.window.priority === "pwd"
                            ? "bg-red-100 text-red-800"
                            : ticket.window.priority === "pregnant"
                            ? "bg-orange-100 text-orange-800"
                            : ticket.window.priority === "senior"
                            ? "bg-blue-100 text-blue-800"
                            : ""
                        }`}
                      >
                        {ticket.window.priority === "pwd"
                          ? "PWD"
                          : ticket.window.priority === "pregnant"
                          ? "Pregnant"
                          : ticket.window.priority === "senior"
                          ? "Senior"
                          : ""}
                      </div>
                    )}
                    {/* Rest of your ticket display code... */}
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
                  {activeFilter !== "all"
                    ? `No ${
                        priorityFilters.find((f) => f.id === activeFilter)
                          ?.label
                      } tickets`
                    : "When tickets arrive, they will appear here"}
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

        {/* Priority Assistance Modal */}
        {isPriorityModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-pink-200">
              <div className="bg-pink-500 p-4 text-center">
                <h2 className="text-xl font-bold text-white">
                  Priority Assistance
                </h2>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-6 text-center">
                  Please select priority level:
                </p>

                {/* PWD Option - Highest Priority */}
                <button
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 mb-3 w-full text-left ${
                    priorityType === "pwd"
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 hover:border-red-300"
                  }`}
                  onClick={() => setPriorityType("pwd")}
                >
                  <div className="flex-shrink-0">
                    <FaWheelchair
                      className={`text-2xl ${
                        priorityType === "pwd"
                          ? "text-red-600"
                          : "text-gray-500"
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">
                      Person with Disability (PWD)
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Highest priority - Immediate assistance
                    </p>
                    {priorityType === "pwd" && (
                      <span className="inline-block mt-1 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                        Priority Level 1
                      </span>
                    )}
                  </div>
                </button>

                {/* Pregnant Option - High Priority */}
                <button
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 mb-3 w-full text-left ${
                    priorityType === "pregnant"
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-orange-300"
                  }`}
                  onClick={() => setPriorityType("pregnant")}
                >
                  <div className="flex-shrink-0">
                    <FaBaby
                      className={`text-2xl ${
                        priorityType === "pregnant"
                          ? "text-orange-600"
                          : "text-gray-500"
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Pregnant</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      High priority - Expedited service
                    </p>
                    {priorityType === "pregnant" && (
                      <span className="inline-block mt-1 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                        Priority Level 2
                      </span>
                    )}
                  </div>
                </button>

                {/* Senior Citizen Option - Medium Priority */}
                <button
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 mb-3 w-full text-left ${
                    priorityType === "senior"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                  onClick={() => setPriorityType("senior")}
                >
                  <div className="flex-shrink-0">
                    <FaUserAlt
                      className={`text-2xl ${
                        priorityType === "senior"
                          ? "text-blue-600"
                          : "text-gray-500"
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Senior Citizen</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Medium priority - Priority queuing
                    </p>
                    {priorityType === "senior" && (
                      <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        Priority Level 3
                      </span>
                    )}
                  </div>
                </button>

                {/* No Priority Option */}
                <button
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 w-full text-left ${
                    priorityType === "none"
                      ? "border-gray-400 bg-gray-100"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setPriorityType("none")}
                >
                  <div className="flex-shrink-0">
                    <span
                      className={`text-2xl ${
                        priorityType === "none"
                          ? "text-gray-600"
                          : "text-gray-400"
                      }`}
                    >
                      —
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">No Priority</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Standard queue processing
                    </p>
                  </div>
                </button>

                <div className="flex gap-3 mt-6">
                  <button
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-medium transition-colors"
                    onClick={() => setIsPriorityModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                    onClick={confirmWithPriority}
                    disabled={!priorityType}
                  >
                    Confirm Priority
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QueueUser;
