import React from "react";
import Navbar from "../../components/userpage/Navbar";
import { NavLink, Outlet } from "react-router-dom";
import { QrCode } from "lucide-react";
import { useTicketStore } from "../../store/useTicketStore";

const UserContent = () => {
  const { checkTicketUser, ticket, checkTicketAuthUser } = useTicketStore();
  return (
    <div className="flex flex-col bg-[#eee] h-full w-full relative xxl:h-screen">
      {/* Navbar Stays at the Top */}
      <Navbar className="w-full fixed top-0 z-30" />
      {ticket.status === "completed" || ticket.status === "void" ? (
        <NavLink
          to="/userpage"
          className="btn btn-circle bg-pink-600 text-white bottom-10 fixed hover:bg-pink-950 right-10 z-20"
        >
          <QrCode />
        </NavLink>
      ) : null}

      {/* Main Content Takes Remaining Height */}
      <div className="h-lex-grow overflow-hidden pb-10 relative">
        <Outlet />
      </div>
    </div>
  );
};

export default UserContent;
