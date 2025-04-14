import React, { useEffect, useState } from "react";
import { useDepartmentStore } from "../../../store/useDepartmentStore";
import { useTicketStore } from "../../../store/useTicketStore";
import { useUserStore } from "../../../store/useUserStore";
import {
  FiUsers,
  FiHome,
  FiTrendingUp,
  FiClock,
  FiFilter,
  FiTrendingDown,
} from "react-icons/fi";
import { IoIosTimer } from "react-icons/io";
import { GiTicket } from "react-icons/gi";
import { MdLaptopWindows } from "react-icons/md";
import { EllipsisVertical } from "lucide-react";

const Cards = () => {
  const { departmentCount, getDepartmenthelperfunctions, referenceCount } =
    useDepartmentStore();
  const { userCount, getUsersCounts } = useUserStore();
  const { totalTickets, setTotalTicket } = useTicketStore();
  const { getUsers, users } = useUserStore();
  const [timeFilter, setTimeFilter] = useState("all"); // 'all', 'today', 'week', 'month'
  const [usertimeFilter, setUserTimeFilter] = useState("all"); // 'all', 'today', 'week', 'month'

  useEffect(() => {
    setTotalTicket();
    getUsers();
    getDepartmenthelperfunctions();
    getUsersCounts();
  }, [timeFilter]);

  const getTrendIcon = (trend) => {
    switch (trend) {
      case "up":
        return <FiTrendingUp className="inline mr-1" />;
      case "down":
        return <FiTrendingDown className="inline mr-1" />;
      default:
        return "→";
    }
  };

  // Conditional classes based on the trend
  const getTrendClasses = (trend) => {
    if (trend === "up") {
      return "bg-green-50 text-green-500";
    } else if (trend === "down") {
      return "bg-red-50 text-red-500";
    } else {
      return "bg-gray-50 text-gray-500";
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-6">
      {/* Department Card */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-lg hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center rounded-lg bg-blue-50 p-3">
            <FiHome className="text-blue-600 text-2xl" />
          </div>
          <div className="text-right">
            <span className="text-xs font-medium text-gray-500">
              Departments
            </span>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">
              {departmentCount}
            </h3>
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <span className="text-xs font-medium text-green-500 bg-green-50 px-2 py-1 rounded-full">
            <MdLaptopWindows className="inline mr-1" />
            {referenceCount?.window_count} total counter/s
          </span>
        </div>
      </div>

      {/* Tickets Card */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-lg hover:shadow-md transition-shadow group relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center rounded-lg bg-purple-50 p-3">
            <GiTicket className="text-purple-600 text-2xl" />
          </div>
          <div className="text-right">
            <span className="text-xs font-medium text-gray-500">
              Total Tickets
            </span>
            {timeFilter && (
              <span className="ml-1 text-xs font-medium text-purple-600">
                {timeFilter === "week" && "| Week"}
                {timeFilter === "month" && "| Month"}
                {timeFilter === "all" && "| All Time"}
              </span>
            )}
            <h3 className="text-2xl font-bold text-gray-800 mt-1">
              {(() => {
                if (timeFilter === "all") {
                  return totalTickets?.all?.count ?? 0;
                } else if (timeFilter === "week") {
                  return totalTickets?.week?.count ?? 0;
                } else if (timeFilter === "month") {
                  return totalTickets?.month?.count ?? 0;
                } else {
                  return 0;
                }
              })()}
            </h3>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs font-medium text-blue-500 bg-blue-50 px-2 py-1 rounded-full">
            <FiClock className="inline mr-1" />
            {totalTickets?.today?.count ?? 0} processed today
          </span>

          <div className="dropdown dropdown-hover dropdown-end">
            <label
              tabIndex={0}
              className="btn btn-ghost btn-xs p-0 m-0 hover:bg-transparent flex items-center"
            >
              <EllipsisVertical className="text-gray-400 hover:text-gray-600 h-4 w-4" />
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-white rounded-box w-40 z-10"
            >
              <li>
                <button
                  onClick={() => setTimeFilter("all")}
                  className={
                    timeFilter === "all" ? "bg-purple-50 text-purple-600" : ""
                  }
                >
                  All Time
                  {timeFilter === "all" && <span className="ml-auto">✓</span>}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setTimeFilter("week")}
                  className={
                    timeFilter === "week" ? "bg-purple-50 text-purple-600" : ""
                  }
                >
                  This Week
                  {timeFilter === "week" && <span className="ml-auto">✓</span>}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setTimeFilter("month")}
                  className={
                    timeFilter === "month" ? "bg-purple-50 text-purple-600" : ""
                  }
                >
                  This Month
                  {timeFilter === "month" && <span className="ml-auto">✓</span>}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Users Card */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-lg hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center rounded-lg bg-green-50 p-3">
            <FiUsers className="text-green-600 text-2xl" />
          </div>
          <div className="text-right">
            <span className="text-xs font-medium text-gray-500">
              Active Users
            </span>
            {usertimeFilter && (
              <span className="ml-1 text-xs font-medium text-purple-600">
                {usertimeFilter === "month" && "| Month"}
                {usertimeFilter === "all" && "| All Time"}
              </span>
            )}
            <h3 className="text-2xl font-bold text-gray-800 mt-1">
              {usertimeFilter === "all"
                ? userCount?.all.count
                : userCount?.month.count}
            </h3>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs font-medium text-yellow-500 bg-yellow-50 px-2 py-1 rounded-full">
            {userCount?.week.count || 0} new this week
          </span>

          {/* Filter dropdown moved to bottom right */}
          <div className="dropdown dropdown-hover dropdown-end">
            <label
              tabIndex={0}
              className="btn btn-ghost btn-xs p-0 m-0 hover:bg-transparent"
            >
              <EllipsisVertical className="text-gray-400 hover:text-gray-600 h-4 w-4" />
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-white rounded-box w-40 z-10"
            >
              <li>
                <button
                  onClick={() => setUserTimeFilter("all")}
                  className={
                    usertimeFilter === "all" ? "bg-green-50 text-green-600" : ""
                  }
                >
                  All Time
                  {usertimeFilter === "all" && (
                    <span className="ml-auto">✓</span>
                  )}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setUserTimeFilter("month")}
                  className={
                    usertimeFilter === "month"
                      ? "bg-green-50 text-green-600"
                      : ""
                  }
                >
                  This Month
                  {usertimeFilter === "month" && (
                    <span className="ml-auto">✓</span>
                  )}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Avg Process Time Card */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-lg hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center rounded-lg bg-orange-50 p-3">
            <IoIosTimer className="text-orange-600 text-2xl" />
          </div>
          <div className="text-right">
            <span className="text-xs font-medium text-gray-500">
              Avg Process Time
            </span>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">
              {referenceCount?.avg.avg_process_time || 0} min
            </h3>
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <span
            className={`text-xs font-medium ${getTrendClasses(
              referenceCount?.avg?.trend
            )} px-2 py-1 rounded-full`}
          >
            {getTrendIcon(referenceCount?.avg?.trend)}
            {referenceCount?.avg?.met_sla_percentage || 0}%{" "}
            {referenceCount?.avg?.trend === "stable" ? "" : "faster"} this month
          </span>
        </div>
      </div>
    </div>
  );
};

export default Cards;
