import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const WeeklyTicketChart = ({ data }) => {
  const totalTickets = data.reduce((sum, day) => sum + day.tickets, 0);
  const averageTickets = Math.round(totalTickets / data.length);
  const peakDay = data.reduce(
    (max, day) => (day.tickets > max.tickets ? day : max),
    data[0]
  );

  return (
    <div className="mt-4">
      <div className="flex justify-between mb-4">
        <div>
          <span className="text-2xl font-bold">{totalTickets}</span>
          <span className="text-sm text-gray-600 ml-1">total tickets</span>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">
            Peak: {peakDay.tickets} on {peakDay.day}
          </div>
          <div className="text-sm text-gray-600">Avg: {averageTickets}/day</div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 20,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" axisLine={true} tickLine={true} />
            <YAxis axisLine={true} tickLine={true} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: "0.5rem",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                border: "none",
              }}
            />
            <Bar
              dataKey="tickets"
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
              animationDuration={1500}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeeklyTicketChart;
