import React, { useEffect, useState } from "react";
import { useTicketStore } from "../../../store/useTicketStore";
import { useWindowStore } from "../../../store/useWindowStore";
import { Navigate, NavLink } from "react-router-dom";
import { FaBaby, FaUserAlt, FaWheelchair } from "react-icons/fa";
import toast from "react-hot-toast";
import { useAuthStore } from "../../../store/useAuthStore";
import Ding from "./Ding";
import { Volume2 } from "lucide-react";

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
    queue_num,
    subscribeToTicket,
    unsubscribeToTicket,
    setDingSound,
  } = useTicketStore();
  const {
    windowId,
    getWindowDetails,
    getTicketWindows,
    dataInProgress,
    getTicketInQueueWindow,
    windowTicketInQueue,
  } = useWindowStore();
  const { socket } = useAuthStore();

  const [proceedData, setProceedData] = useState("");
  const [selectedWindow, setSelectedWindow] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [isPriorityModalOpen, setIsPriorityModalOpen] = useState(false);
  const [priorityType, setPriorityType] = useState(null);
  const [ticketIdState, setTicketIdState] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [color, setColor] = useState("text-green-500");
  const [disabled, setDisabled] = useState(false);

  const [playNow, setPlayNow] = useState(false);
  const [mockTicket, setMockTicket] = useState({
    number: null,
    counter: null,
    priority: false, // change this to false for standard
  });

  useEffect(() => {
    if (!windowId) return;
    getAllTickets();
    getWindowDetails();
    getTicketInQueueWindow();
  }, [windowId, isTicketUpdate, isStatusUpdated, queue_num]);

  useEffect(() => {
    if (!windowId) return;
    getTicketWindows();
  }, [windowTicketInQueue]);

  useEffect(() => {
    subsToUpdateStatus();
    subscribeToTicket();
    8;
    return () => {
      unsubsubsToUpdateStatus();
      unsubscribeToTicket();
    };
  }, [isTicketUpdate, socket, queue_num]);

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

  const handleClick = () => {
    setDisabled(true); // disable on click

    let count = 0;
    const interval = setInterval(() => {
      setColor((prev) =>
        prev === "text-green-500" ? "text-red-500" : "text-green-500"
      );
      count++;
      if (count >= 26) {
        clearInterval(interval);
        setDisabled(false);
      }
    }, 200);
  };

  const handleAnnounce = (ticket) => {
    setDingSound(ticket);
  };

  // useEffect(() => {
  //   const socket1 = socket;

  //   if (!socket1) return;
  //   socket1.on("makeDingSound", (ticket) => {
  //     console.log("lowestWaiting: ", ticket);
  //     setMockTicket({
  //       number: ticket.ticket_number,
  //       counter: ticket.service_type || "Counter",
  //       priority:
  //         ticket.priority_lvl &&
  //         ticket.priority_lvl !== "none" &&
  //         ticket.ticket_number > ticket.lowestWaiting,
  //     });
  //     setPlayNow(false); // Reset to allow re-trigger
  //     setTimeout(() => setPlayNow(true), 100);
  //   });

  //   return () => socket1.off("makeDingSound");
  // }, [socket]);

  const filteredTickets = {
    [activeFilter]: windowTicketInQueue?.filter((ticket) => {
      if (activeFilter === "all") return true;
      return ticket.window.priority === activeFilter;
    }),
  };

  const priorityFilters = [
    {
      id: "all",
      label: "All",
      color: "pink",
      bg: "pink-200",
    },
    {
      id: "none",
      label: "Standard",
      color: "purple",
      bg: "green-300",
    },
    {
      id: "pwd",
      label: "PWD",
      color: "red",
      bg: "pink-200",
    },
    {
      id: "pregnant",
      label: "Pregnant",
      color: "orange",
      bg: "orange-100",
    },
    {
      id: "senior",
      label: "Senior",
      color: "blue",
      bg: "blue-100",
    },
  ];

  const ticketCounts = {
    all: windowTicketInQueue?.length ?? 0,
    none:
      windowTicketInQueue?.filter((ticket) => !ticket.window.priority).length ??
      0,
    none:
      windowTicketInQueue?.filter((ticket) => ticket.window.priority === "none")
        .length ?? 0,
    pwd:
      windowTicketInQueue?.filter((ticket) => ticket.window.priority === "pwd")
        .length ?? 0,
    pregnant:
      windowTicketInQueue?.filter(
        (ticket) => ticket.window.priority === "pregnant"
      ).length ?? 100,
    senior:
      windowTicketInQueue?.filter(
        (ticket) => ticket.window.priority === "senior"
      ).length ?? 0,
  };

  // console.log("[count: ", windowTicketInQueue[1].window.priority);
  return (
    <div className="min-h-screen bg-pink-50 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Queue Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-pink-100">
          <div className="bg-gradient-to-r from-pink-500 to-pink-400 p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-bold text-white">In Queue</h2>
              </div>
              {/* <span className="bg-white text-pink-600 px-3 py-1 rounded-full text-sm font-medium">
                {windowTicketInQueue?.length || 0} waiting
              </span> */}
            </div>

            {/* Priority Filters */}
            <div className="mt-3 flex flex-wrap gap-2">
              {priorityFilters.map((filter) => (
                <div key={filter.id}>
                  <button
                    onClick={() => setActiveFilter(filter.id)}
                    className={`relative px-6 py-3 rounded-full text-xs font-medium ${
                      activeFilter === filter.id
                        ? `bg-${filter.bg} text-${filter.color}-800 border-${filter.color}-500 border`
                        : `bg-white text-gray-700 hover:bg-gray-100`
                    }`}
                  >
                    {ticketCounts[filter.id] !== 0 &&
                      (ticketCounts[filter.id] < 100 ? (
                        <p className="flex justify-center items-center absolute -top-4 -right-1 rounded-full bg-purple-100 px-2 py-1 text-sm">
                          <span className="font-sans font-semibold">
                            {ticketCounts[filter.id]}
                          </span>
                        </p>
                      ) : (
                        <p className="flex justify-center items-center absolute -top-4 -right-1 rounded-full bg-purple-100 px-2 py-1 text-sm">
                          <span className="text-red-600 font-sans font-semibold">
                            {ticketCounts[filter.id]}
                          </span>
                          <span className="text-red-600 font-bold">+</span>
                        </p>
                      ))}

                    {filter.label}
                  </button>
                </div>
              ))}
            </div>
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
                        : ticket.window.priority === "all"
                        ? "ring-2 ring-pink-500"
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedTicketId((prev) =>
                        prev === ticket.window.id ? null : ticket.window.id
                      )
                    }
                  >
                    {ticket.window.priority && (
                      <div
                        className={`absolute top-1 left-1 px-2 py-1 rounded-full text-xs font-bold ${
                          ticket.window.priority === "pwd"
                            ? "bg-red-100 text-red-800"
                            : ticket.window.priority === "pregnant"
                            ? "bg-orange-100 text-orange-800"
                            : ticket.window.priority === "senior"
                            ? "bg-blue-100 text-blue-800"
                            : ticket.window.priority === "all"
                            ? "ring-2 ring-pink-500"
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
                          ticket.window.status !== "In Progress" &&
                          ticket.window.status !== "On Hold" && (
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
                        className={`absolute right-5 top-1/2 transform -translate-y-1/2 bg-red-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 ${
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
                        <span>On Hold</span>
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
                    <div className="absolute">
                      <p className="bg-purple-100 p-2 border-2 border-green-700 rounded-full">
                        <Volume2
                          className={`transition duration-150 ${color} ${
                            disabled ? "cursor-not-allowed" : "cursor-pointer"
                          }`}
                          onClick={() => {
                            if (disabled) return;
                            handleClick();
                            handleAnnounce(y);
                          }}
                        />
                      </p>
                    </div>

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
                        <div
                          className={`absolute -right-5 top-1 px-2 py-1 rounded-full text-xs font-bold ${
                            y.window.priority === "pwd"
                              ? "bg-red-100 text-red-800"
                              : y.window.priority === "pregnant"
                              ? "bg-orange-100 text-orange-800"
                              : y.window.priority === "senior"
                              ? "bg-blue-100 text-blue-800"
                              : ""
                          }`}
                        >
                          {y.window.priority === "pwd"
                            ? "PWD"
                            : y.window.priority === "pregnant"
                            ? "Pregnant"
                            : y.window.priority === "senior"
                            ? "Senior"
                            : ""}
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

        <Ding
          ticketNumber={mockTicket.number}
          counterNumber={mockTicket.counter}
          isPriority={mockTicket.priority}
          play={playNow}
        />
      </div>
    </div>
  );
};

export default QueueUser;
