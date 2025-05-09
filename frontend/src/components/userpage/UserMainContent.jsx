import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPersonWalkingDashedLineArrowRight,
  faTableList,
} from "@fortawesome/free-solid-svg-icons";
import InQueue from "./InQueue";
import UserTicket from "./UserTicket";
import { useTicketStore } from "../../store/useTicketStore";
import { useWindowStore } from "../../store/useWindowStore";
import BreakTime from "../usermodal/BreakTime";
import { useAuthStore } from "../../store/useAuthStore";
import Ding from "../DepartmentAdmin_Dashboard/MainContent/Ding";

const UserMainContent = () => {
  const {
    checkTicketUser,
    checkTicketAuthUser,
    subscribeToCutOff,
    unsubscribeToCutOff,
    isBreakTime,
    subsTicketVoidTimer,
    unsubsTicketVoidTimer,
    calledTicket,
    getBreakTime,
    getCutOff,
    subsToUpdateStatus,
    unsubsubsToUpdateStatus,
    subscribeToBreakTime,
    unsubscribeToBreakTime,
  } = useTicketStore();
  const { socket } = useAuthStore();
  const [activeButton, setActiveButton] = useState("button1");
  const [playNow, setPlayNow] = useState(false);
  const [mockTicket, setMockTicket] = useState({
    number: null,
    counter: null,
    priority: false, // change this to false for standard
  });

  const handleButtonClick = (buttonId) => {
    setActiveButton(buttonId);
  };

  const { isUpdated } = useWindowStore();

  useEffect(() => {
    getBreakTime();
    getCutOff();
  }, []);

  useEffect(() => {
    checkTicketAuthUser();
    checkTicketUser();
  }, [isUpdated, activeButton, calledTicket]);

  useEffect(() => {
    subscribeToBreakTime();
    subscribeToCutOff();
    return () => {
      unsubscribeToCutOff();
      unsubscribeToBreakTime();
    };
  }, [socket]);

  useEffect(() => {
    subsToUpdateStatus();
    return () => unsubsubsToUpdateStatus();
  }, [socket]);

  useEffect(() => {
    subsTicketVoidTimer();
    return () => unsubsTicketVoidTimer();
  }, [socket]);

  useEffect(() => {
    const socket1 = socket;

    if (!socket1) return;
    socket1.on("makeDingSound", (ticket) => {
      console.log("lowestWaiting: ", ticket);
      setMockTicket({
        number: ticket.ticket_number,
        counter: ticket.service_type || "Counter",
        priority:
          ticket.priority_lvl &&
          ticket.priority_lvl !== "none" &&
          ticket.ticket_number > ticket.lowestWaiting,
      });
      setPlayNow(false); // Reset to allow re-trigger
      setTimeout(() => setPlayNow(true), 100);
    });

    return () => socket1.off("makeDingSound");
  }, [socket]);

  return (
    <div className="flex flex-col h-screen w-full bg-[#eee]">
      {/* Button Section (Aligned Top-Right) */}
      {isBreakTime && <BreakTime />}

      <div className="absolute top-20 right-5 flex gap-4 z-20">
        <button
          className={`bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 flex gap-2 items-center transition duration-300 ease-in-out 
          ${activeButton === "button1" ? "bg-pink-950" : "bg-pink-600"}`}
          onClick={() => handleButtonClick("button1")}
        >
          <FontAwesomeIcon icon={faTableList} />
          <span className="hidden md:inline">My Ticket</span>
        </button>
        <button
          className={`bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 flex gap-2 items-center transition duration-300 ease-in-out 
          ${activeButton === "button2" ? "bg-pink-950" : "bg-pink-600"}`}
          onClick={() => handleButtonClick("button2")}
        >
          <FontAwesomeIcon icon={faPersonWalkingDashedLineArrowRight} />
          <span className="hidden md:inline">In Queue</span>
        </button>
      </div>

      {/* Centered Content */}
      <div className="flex flex-grow items-center justify-center">
        {activeButton === "button1" ? <UserTicket /> : <InQueue />}
      </div>

      <Ding
        ticketNumber={mockTicket.number}
        counterNumber={mockTicket.counter}
        isPriority={mockTicket.priority}
        play={playNow}
      />
    </div>
  );
};

export default UserMainContent;
