import React, { useEffect } from "react";
import { useTicketStore } from "../../store/useTicketStore";
import { useDepartmentStore } from "../../store/useDepartmentStore";
import { formatMessageDate, formatMessageTime } from "../../lib/utils";
import Navbar from "./Navbar";

const UserTicket = () => {
  const { getTicket, checkTicketAuthUser, ticket } = useTicketStore();
  const { selectedDepartment } = useDepartmentStore();

  useEffect(() => {
    checkTicketAuthUser();
    getTicket();
  }, [checkTicketAuthUser]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Navbar className="absolute top-0" />
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md border border-blue-500 text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          🎟️ Your Ticket Status
        </h2>

        {ticket ? (
          ticket.status === "completed" ? (
            // ✅ Completed Ticket UI
            <div>
              <h1 className="text-3xl font-bold text-green-600">
                Ticket Completed 🎉
              </h1>
              <p className="text-gray-600 mt-2">
                Thank you for using our service.
              </p>
            </div>
          ) : (
            // ✅ Active Ticket UI
            <>
              <h1
                className={
                  ticket.status === "waiting"
                    ? "text-3xl font-bold text-pink-500"
                    : "text-3xl font-bold text-green-500"
                }
              >
                {ticket.status === "waiting" ? "In Queue" : "Your Turn"}
              </h1>

              <div className="mt-4 text-gray-600 text-sm">Queue Number</div>
              <div className="text-5xl font-extrabold text-blue-600">
                {ticket.ticket_number}
              </div>

              <div className="mt-2 text-gray-500 text-sm">
                <strong>Department:</strong> {ticket?.service_type || "N/A"}
              </div>
              <div className="mt-2 text-gray-500 text-sm">
                <strong>Counter:</strong> {ticket?.window_number || "N/A"}
              </div>

              {/* ✅ Status Badge */}
              <div className="mt-2 text-gray-500 text-sm">
                <strong>Status:</strong>
                <span
                  className={`ml-1 px-2 py-1 rounded ${
                    ticket.status === "waiting"
                      ? "bg-yellow-400 text-white"
                      : ticket.status === "serving"
                      ? "bg-green-500 text-white"
                      : "bg-gray-400 text-white"
                  }`}
                >
                  {ticket.status}
                </span>
              </div>

              {/* ✅ Issued At */}
              <div className="mt-2 text-gray-600 text-sm">
                <strong>Issued at:</strong>{" "}
                {formatMessageDate(ticket.issued_at)} {" || "}
                {formatMessageTime(ticket.issued_at)}
              </div>

              {/* ✅ Refresh Button */}
              {/* <button
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold shadow-md hover:bg-blue-700 transition"
                onClick={handleRefresh}
              >
                Refresh Status
              </button> */}
            </>
          )
        ) : (
          // ✅ No Ticket Found UI
          <p className="text-gray-500 mt-4">No active ticket found.</p>
        )}
      </div>
    </div>
  );
};

export default UserTicket;
