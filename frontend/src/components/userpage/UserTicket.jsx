import React, { useEffect } from "react";
import { useTicketStore } from "../../store/useTicketStore";
import { useDepartmentStore } from "../../store/useDepartmentStore";
import { formatMessageDate, formatMessageTime } from "../../lib/utils";
import Navbar from "./Navbar";
import YourTurnMessage from "./YourTurnMessage";
import { useWindowStore } from "../../store/useWindowStore";
import { useAuthStore } from "../../store/useAuthStore";
import TicketVoided from "./TicketVoided";
import TicketTimer from "./TicketTimer";

const UserTicket = () => {
  const { ticket } = useTicketStore();
  const { subscribeNewTicketWindows, unsubscribeNewTicketWindows } =
    useWindowStore();
  const { socket } = useAuthStore();

  useEffect(() => {
    subscribeNewTicketWindows();
    return () => unsubscribeNewTicketWindows();
  }, [socket]);

  return (
    <div className="flex flex-col h-full justify-center p-4 w-full items-center">
      <div className="bg-white border border-blue-500 p-6 rounded-lg shadow-lg text-center w-full max-w-md">
        <h2 className="text-gray-800 text-xl font-bold mb-2">
          🎟️ Your Ticket Status
        </h2>

        {ticket ? (
          ticket.status === "completed" ? (
            // ✅ Completed Ticket UI
            <div>
              <h1 className="text-3xl text-green-600 font-bold">
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
                    : ""
                }
              >
                {ticket.status === "waiting" ? (
                  "In Queue"
                ) : ticket.status === "In Progress" ? (
                  <YourTurnMessage />
                ) : ticket.status === "On Hold" ? (
                  <TicketTimer />
                ) : ticket.status === "void" ? (
                  <TicketVoided />
                ) : null}{" "}
              </h1>

              <div className="text-gray-600 text-sm mt-4">Queue Number</div>
              <div className="text-9xl text-blue-600 font-extrabold">
                {ticket.ticket_number}
              </div>

              {/* <div className="text-gray-500 text-sm mt-2">
                <strong>Department:</strong> {ticket?.service_type || "N/A"}
              </div> */}
              <div className="text-gray-500 text-sm mt-2">
                <strong>Counter Name:</strong> {ticket?.service_type || "N/A"}
              </div>

              {/* ✅ Status Badge */}
              <div className="text-gray-500 text-sm mt-2">
                <strong>Status:</strong>
                <span
                  className={`ml-1 px-2 py-1 rounded ${
                    ticket.status === "waiting"
                      ? "bg-yellow-400 text-white"
                      : ticket.status === "In Progress"
                      ? "bg-green-500 text-white"
                      : "bg-gray-400 text-white"
                  }`}
                >
                  {ticket.status}
                </span>
              </div>

              {/* ✅ Issued At */}
              <div className="text-gray-600 text-sm mt-2">
                <strong>Issued at:</strong>{" "}
                {formatMessageDate(ticket.issued_at)} {" || "}
                {formatMessageTime(ticket.issued_at)}
              </div>

              {/* ✅ Refresh Button */}
              {/* <button
                className="bg-blue-600 rounded-lg shadow-md text-sm text-white w-full font-semibold hover:bg-blue-700 mt-4 py-2 transition"
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
