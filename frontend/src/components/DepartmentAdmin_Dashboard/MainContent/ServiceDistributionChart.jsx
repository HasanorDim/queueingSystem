import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const ServiceDistributionChart = ({ data }) => {
  if (!data || !Array.isArray(data)) return null;

  const filteredData = data
    .filter((item) => item.count > 0)
    .map((item) => ({
      ...item,
      percentage: parseFloat(item.percentage),
    }));

  if (filteredData.length === 0) return null;

  const totalServices = filteredData.reduce(
    (sum, service) => sum + service.count,
    0
  );

  return (
    <div>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={filteredData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="percentage"
            >
              {filteredData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Custom Legend */}
      <div className="mt-2 space-y-1">
        {filteredData.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between text-sm text-gray-700"
          >
            <div className="flex items-center">
              <span
                className="inline-block w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: item.color }}
              ></span>
              {item.name}
            </div>
            <div>
              {item.count} tickets ({item.percentage}%)
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200 text-sm text-gray-600 flex justify-between">
        <span>Total: {totalServices} tickets</span>
        <button className="text-blue-600 hover:text-blue-800">
          View details
        </button>
      </div>
    </div>
  );
};

export default ServiceDistributionChart;
