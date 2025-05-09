import React, { useEffect, useState } from "react";
// import Ding from "../DepartmentAdmin_Dashboard/MainContent/Ding";
// import { useAuthStore } from "../../store/useAuthStore";

const YourTurnMessage = () => {
  return (
    <div className="w-full p-4 bg-green-500 text-white text-center rounded-lg shadow-md mt-4 animate-bounce">
      <h3 className="text-xl font-bold">🎉 Your Turn! 🎉</h3>
      <p className="text-sm">Please proceed to your window.</p>
    </div>
  );
};

export default YourTurnMessage;

// import React from "react";

// const YourTurnMessage = () => {
//   return (
//     <div className="w-full p-4 bg-green-500 text-white text-center rounded-lg shadow-md mt-4 animate-bounce">
//       <h3 className="text-xl font-bold">🎉 Your Turn! 🎉</h3>
//       <p className="text-sm">Please proceed to your window.</p>
//     </div>
//   );
// };

// export default YourTurnMessage;
