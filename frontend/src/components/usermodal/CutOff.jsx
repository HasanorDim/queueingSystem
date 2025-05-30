import React from "react";

const CutOff = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md animate-fadeIn">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center border border-red-300">
        <h2 className="text-2xl font-semibold text-red-600">Queue Closed</h2>
        <p className="mt-2 text-gray-700">
          The queue is currently closed. Please wait for the admin to lift the
          cutoff.
        </p>
      </div>
    </div>
  );
};

export default CutOff;
