import React, { useEffect } from "react";
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
  } = useWindowStore();

  useEffect(() => {
    if (windowId) {
      getAllTickets();
      getWindowDetails();
      getTicketWindows();
    }
  }, []); // Added dependencies

  if (!windowId) {
    return <Navigate to="/department-dashboard/windows" />;
  }

  const queueUsers = [
    { id: 1, name: "John Doe", status: "In Progress" },
    { id: 2, name: "Jane Smith", status: "Waiting" },
    { id: 3, name: "Robert Brown", status: "Waiting" },
    { id: 4, name: "Emily White", status: "Waiting" },
    { id: 5, name: "Michael Johnson", status: "Waiting" },
    { id: 6, name: "Sarah Lee", status: "Waiting" },
    { id: 7, name: "David Wilson", status: "Waiting" },
    { id: 8, name: "Emma Taylor", status: "Waiting" },
    { id: 9, name: "Daniel Martinez", status: "Waiting" },
    { id: 10, name: "Sophia Anderson", status: "Waiting" },
  ];

  return (
    <div className="">
      {/* Sticky Header */}
      <div className="max-w-lg mx-auto bg-white px-5 rounded-2xl shadow-2xl h-[400px] overflow-y-auto space-y-10 pb-5">
        {/* Scrollable List */}
        <h2 className="text-2xl font-bold text-center bg-pink-400 rounded-md  text-gray-800 sticky top-0 z-10 pb-4">
          Queue Users
        </h2>
        <div className="relative max-h-[400px] w-full">
          <hr className="bg-gray-300" />
          {windowTicket?.length > 0 ? (
            windowTicket.map((ticket) => (
              <div
                key={ticket.window.id}
                className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center bg-pink-500 text-white font-bold rounded-full">
                    {ticket.window.ticket_number}
                  </div>
                  <span className="font-medium text-gray-700">
                    {ticket.users.firstname} {ticket.users.lastname}
                  </span>
                </div>
                <span
                  className={`px-4 py-1 text-sm font-medium rounded-full shadow ${
                    ticket.window.status === "In Progress"
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-300 text-gray-700"
                  }`}
                >
                  {ticket.window.status}
                </span>
              </div>
            ))
          ) : (
            <tr>
              <td
                colSpan="7"
                className="absolute w-full text-center py-8 text-xl italic font-semibold text-gray-500"
              >
                In Queue Empty
              </td>
            </tr>
          )}
        </div>
      </div>
    </div>
  );
};

export default QueueUser;
