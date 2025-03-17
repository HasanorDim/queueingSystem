import React from "react";

const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center h-screen w-full bg-gray-100">
      <div className="flex flex-col items-center">
        {/* Spinner Animation */}
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
        {/* Loading Text */}
        <p className="mt-4 text-lg font-semibold text-gray-700">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
