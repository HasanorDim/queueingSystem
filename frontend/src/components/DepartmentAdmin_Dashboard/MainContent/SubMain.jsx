import React, { useEffect } from "react";
import { useTicketStore } from "../../../store/useTicketStore";
import WeeklyTicketChart from "./WeeklyTicketChart";
import ServiceDistributionChart from "./ServiceDistributionChart";
import { FiCalendar, FiUsers, FiPieChart, FiAlertCircle } from "react-icons/fi";

const SubMain = () => {
  const { setTotalTicketByDepartments, totalTickets, otherData, getOtherData } =
    useTicketStore();

  useEffect(() => {
    getOtherData();
    setTotalTicketByDepartments();
  }, []);

  const getTrendIcon = (trend) => {
    switch (trend) {
      case "up":
        return "↑";
      case "down":
        return "↓";
      default:
        return "→";
    }
  };

  // No tickets state
  if (!totalTickets || totalTickets.length <= 0) {
    console.log("No tickets");
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Full width when no tickets */}
          <div className="lg:col-span-3 space-y-6">
            {/* Empty State Card */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-8 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                  <FiAlertCircle className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Tickets Available / History Transactions
                </h3>
                <p className="text-gray-500 mb-6">
                  There are currently no tickets in the system. New tickets will
                  appear here when created.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Existing ticket data rendering...
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();
  const currentDay = today.getDay();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - currentDay);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const thisWeekTickets = totalTickets.filter((ticket) => {
    const issuedDate = new Date(ticket.issued_at);
    return issuedDate >= startOfWeek && issuedDate <= endOfWeek;
  });

  const ticketCountsByDay = thisWeekTickets.reduce((acc, ticket) => {
    const date = new Date(ticket.issued_at);
    const dayName = daysOfWeek[date.getDay()];
    acc[dayName] = (acc[dayName] || 0) + 1;
    return acc;
  }, {});

  const weeklyTickets = daysOfWeek.map((day) => ({
    day,
    tickets: ticketCountsByDay[day] || 0,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Weekly Ticket Trends Panel */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                Weekly Ticket Trends
              </h2>
            </div>
            <div className="p-4">
              <WeeklyTicketChart data={weeklyTickets} />
            </div>
          </div>

          {/* New Users Panel */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">
                New Users This Month ({otherData?.newUsers?.count || 0})
              </h2>
              <button className="text-sm text-blue-600 hover:text-blue-800">
                View All
              </button>
            </div>
            <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
              {otherData?.newUsers?.users?.map((user) => (
                <div
                  key={user.id}
                  className="p-4 hover:bg-gray-50 transition-colors flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {user.firstname} {user.lastname}
                    </p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    Joined{" "}
                    {new Date(user.joined).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Ticket Statistics Panel */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">
                Ticket Statistics
              </h2>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  otherData?.ticketStat?.trend === "up"
                    ? "bg-green-100 text-green-800"
                    : otherData?.ticketStat?.trend === "down"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {getTrendIcon(otherData?.ticketStat?.trend)}{" "}
                {otherData?.ticketStat?.percentageChange || 0}% from yesterday
              </span>
            </div>
            <div className="p-4 grid grid-cols-2 gap-4">
              {Object.entries(otherData?.avgTime || {})
                .filter(([key]) => key !== "trend")
                .map(([key, value]) => (
                  <div
                    key={key}
                    className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
                  >
                    <p className="text-sm text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </p>
                    <p className="text-xl font-medium mt-1">
                      {value === null || value === undefined
                        ? "N/A"
                        : key.toLowerCase().includes("sla") ||
                          key.toLowerCase().includes("compliance")
                        ? `${value}`
                        : key.toLowerCase().includes("time")
                        ? `${value}`
                        : value}
                    </p>
                  </div>
                ))}
            </div>
          </div>

          {/* Service Distribution Panel */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                Service Distribution
              </h2>
            </div>
            <div className="p-4">
              <ServiceDistributionChart
                data={otherData?.serviceDistributions || []}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubMain;
