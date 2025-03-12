import React, { useEffect } from "react";
import { useTicketStore } from "../../../store/useTicketStore";
import { useWindowStore } from "../../../store/useWindowStore";
import { Navigate } from "react-router-dom";

const TicketTable = () => {
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

  return (
    <div>
      <div className="my-6 px-3 py-3 bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-300 border-l-4 border-pink-500 shadow-md rounded-lg">
        <h3 className="text-xl font-bold">
          Tickets for:{" "}
          <span className="text-pink-600 dark:text-pink-400">
            {selectedWindow?.service_type}
          </span>
        </h3>
      </div>

      {/* Table */}
      <div className="lg:mt-0 rounded shadow bg-white">
        <div className="relative overflow-x-auto sm:rounded-lg h-[calc(100vh-18rem)] overflow-scroll shadow-slate-700 shadow-2xl">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-black uppercase bg-pink-200 dark:bg-gray-700 dark:text-gray-400 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3">Full Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Phone Number</th>
                <th className="px-6 py-3">Age</th>
                <th className="px-6 py-3">Gender</th>
                <th className="px-6 py-3">Ticket Number</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {windowTicket?.length > 0 ? (
                windowTicket.map((ticket) => (
                  <tr
                    key={ticket.window.id}
                    className="odd:bg-blue-100 odd:dark:bg-blue-900 even:bg-green-100 even:dark:bg-green-800 border-b dark:border-gray-700 border-gray-200"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {ticket.users.firstname} {ticket.users.lastname}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {ticket.users.email}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {ticket.user_details.phone_number}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {ticket.user_details.age}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {/* {ticket.gender} */}
                      Male
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {ticket.window.ticket_number}
                    </td>
                    <td
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      // data-user-status={ticket.status}
                      // data-user-id={ticket.id}
                    >
                      {ticket.window.status === "waiting" && (
                        <span className="badge bg-yellow-500 text-white px-2 py-1 rounded">
                          Waiting
                        </span>
                      )}
                      {ticket.window.status === "In Progress" && (
                        <span className="badge bg-blue-500 text-white px-2 py-1 rounded">
                          In Progress
                        </span>
                      )}
                      {ticket.window.status === "completed" && (
                        <span className="badge bg-green-500 text-white px-2 py-1 rounded">
                          Completed
                        </span>
                      )}
                      {ticket.window.status === "expired" && (
                        <span className="badge bg-red-500 text-white px-2 py-1 rounded">
                          Expired
                        </span>
                      )}
                      {![
                        "waiting",
                        "In Progress",
                        "completed",
                        "expired",
                      ].includes(ticket.window.status) && (
                        <span className="badge bg-gray-500 text-white px-2 py-1 rounded">
                          Unknown
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-8 text-xl italic font-semibold dark:text-gray-300"
                  >
                    No available tickets
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TicketTable;
