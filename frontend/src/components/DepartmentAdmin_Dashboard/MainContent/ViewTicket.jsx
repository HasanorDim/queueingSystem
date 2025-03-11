import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useTicketStore } from "../../../store/useTicketStore";
const ViewTicket = () => {
  const [openModalId, setOpenModalId] = useState(null);
  const { getAllTickets, allTickets } = useTicketStore();
  const [isNoTickets, setisNoTickets] = useState(false);

  useEffect(() => {
    getAllTickets();
  }, []);
  const openModal = (id) => setOpenModalId(id);
  const closeModal = () => setOpenModalId(null);

  console.log("allTickets: ", allTickets || "none");

  return (
    <div className="p-8 mt-6 lg:mt-0 rounded shadow">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-black">Queue List</h1>
        {/* <Link
          to="/admin/queue/create"
          className="ml-4 bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 flex items-center transition duration-300 ease-in-out"
        >
          <i className="fas fa-plus mr-2"></i>
          <span className="hidden md:inline">Create Queue</span>
        </Link> */}
      </div>

      <hr className="bg-gray-300 my-6" />

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-black uppercase bg-pink-200">
            <tr>
              <th className="px-6 py-3">User Name</th>
              <th className="px-6 py-3">Queue number</th>
              {/* <th className="px-6 py-3">Queue Type</th> */}
              {/* <th className="px-6 py-3">Queue Code</th> */}
              {/* <th className="px-6 py-3">Department</th> */}
              <th className="px-6 py-3">Counter</th>
              <th className="px-6 py-3">Status</th>
              {/* <th className="px-6 py-3">Action</th> */}
            </tr>
          </thead>
          <tbody className="relative">
            {allTickets?.rows ? (
              allTickets?.rows.map((queue, index) => (
                <tr
                  key={index}
                  className="odd:bg-blue-100 even:bg-green-100 border-b border-gray-200"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {queue.firstname} {queue.lastname}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {queue.ticket_number}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {queue.window_number}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {queue.status}
                  </td>
                  {/*<td className="px-6 py-4 font-medium text-gray-900">
                  {queue.ticket_counter}
                </td> */}
                  {/* <td className="px-6 py-4 font-medium text-gray-900">
                  Completed
                </td> */}
                  {/* <td className="flex space-x-2 px-6 py-4">
                  <Link
                    to={`/admin/queue/edit/${queue.id}`}
                    className="flex items-center text-white bg-pink-500 px-3 py-1 rounded hover:bg-pink-600"
                  >
                    <i className="fas fa-edit mr-2"></i> Edit
                  </Link>
                  <button
                    onClick={() => openModal(queue.id)}
                    className="flex items-center text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600"
                  >
                    <i className="fas fa-trash mr-2"></i> Delete
                  </button>
                </td> */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-400">
                  <h1 className="italic font-bold text-lg">No tickets found</h1>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewTicket;
