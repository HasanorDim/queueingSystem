import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPersonWalkingDashedLineArrowRight,
  faTableList,
} from "@fortawesome/free-solid-svg-icons";
import InQueue from "./InQueue";
import UserTicket from "./UserTicket";
import Navbar from "./Navbar";
import { useTicketStore } from "../../store/useTicketStore";

const UserMainContent = () => {
  const { checkTicketAuthUser } = useTicketStore();
  const [activeButton, setActiveButton] = useState("button1");

  const handleButtonClick = (buttonId) => {
    setActiveButton(buttonId);
  };

  useEffect(() => {
    checkTicketAuthUser();
  }, []);
  return (
    <div className="flex flex-col h-screen w-full bg-[#eee]">
      {/* Button Section (Aligned Top-Right) */}
      <div className="absolute top-20 right-5 flex gap-4 ">
        <button
          className={`bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 flex gap-2 items-center transition duration-300 ease-in-out 
          ${activeButton === "button1" ? "bg-pink-950" : "bg-pink-600"}`}
          onClick={() => handleButtonClick("button1")}
        >
          <FontAwesomeIcon icon={faTableList} />
          <span className="hidden md:inline">In Queue</span>
        </button>
        <button
          className={`bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 flex gap-2 items-center transition duration-300 ease-in-out 
          ${activeButton === "button2" ? "bg-pink-950" : "bg-pink-600"}`}
          onClick={() => handleButtonClick("button2")}
        >
          <FontAwesomeIcon icon={faPersonWalkingDashedLineArrowRight} />
          <span className="hidden md:inline">My Ticket</span>
        </button>
      </div>

      {/* Centered Content */}
      <div className="flex flex-grow items-center justify-center">
        {activeButton === "button1" ? <InQueue /> : <UserTicket />}
      </div>
    </div>
  );
};

export default UserMainContent;
