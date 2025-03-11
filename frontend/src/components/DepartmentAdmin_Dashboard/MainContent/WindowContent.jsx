import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPersonWalkingDashedLineArrowRight,
  faTableList,
} from "@fortawesome/free-solid-svg-icons";
import TicketTable from "./TicketTable";
import QueueUser from "./QueueUser";

const WindowContent = () => {
  const [activeButton, setActiveButton] = useState(false);

  useEffect(() => {
    setActiveButton("button1");
  }, []);

  const handleButtonClick = (buttonId) => {
    setActiveButton(buttonId);
  };
  return (
    <div className="p-8 mt-6 lg:mt-0 rounded shadow h-full overflow-y-hidden">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-black">Queue List</h1>
        <div className="flex">
          <button
            className={`ml-4 bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 flex gap-2 items-center transition duration-300 ease-in-out 
            ${activeButton === "button1" ? "bg-pink-950" : "bg-pink-600"}`}
            onClick={() => handleButtonClick("button1")}
          >
            <FontAwesomeIcon icon={faTableList} />
            <span className="hidden md:inline">Ticket table</span>
          </button>
          <button
            className={`ml-4 bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 flex gap-2 items-center transition duration-300 ease-in-out 
            ${activeButton === "button2" ? "bg-pink-950" : "bg-pink-600"}`}
            onClick={() => handleButtonClick("button2")}
          >
            <FontAwesomeIcon icon={faPersonWalkingDashedLineArrowRight} />
            <span className="hidden md:inline">In Queue</span>
          </button>
        </div>
      </div>

      <hr className="bg-gray-300 my-6" />

      {activeButton === "button1" ? <TicketTable /> : <QueueUser />}
    </div>
  );
};

export default WindowContent;
