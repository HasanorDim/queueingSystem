import React, { useEffect } from "react";

const BreakTime = () => {
  return (
    <div className="fixed inset-0 flex items-center bg-transparent justify-center z-20 animate-pulse">
      <div className="bg-pink-50 p-8 rounded-2xl shadow-xl max-w-md text-center border border-red-300">
        <h2 className="text-2xl font-semibold text-red-600">Break Time</h2>
        <img src="/undraw_eating-together_4cna.svg" alt="" />
        <p className="mt-2 text-gray-700">
          The queue is currently Paused. Please wait for the admin to resume the
          queue.
        </p>
      </div>
    </div>
  );
};

export default BreakTime;
