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
