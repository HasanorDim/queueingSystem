import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const dummyQueues = [
  {
    id: 1,
    queue_name: "General Inquiry",
    queue_type: "Standard",
    queue_code: "GEN001",
    department: "Customer Service",
    ticket_counter: "Counter 1",
  },
  {
    id: 2,
    queue_name: "Billing",
    queue_type: "Priority",
    queue_code: "BILL002",
    department: "Finance",
    ticket_counter: "Counter 2",
  },
  {
    id: 3,
    queue_name: "Technical Support",
    queue_type: "Express",
    queue_code: "TECH003",
    department: "IT Support",
    ticket_counter: "Counter 3",
  },
  {
    id: 4,
    queue_name: "Document Processing",
    queue_type: "Standard",
    queue_code: "DOC004",
    department: "Records Office",
    ticket_counter: "Counter 4",
  },
  {
    id: 5,
    queue_name: "Complaints",
    queue_type: "Priority",
    queue_code: "COMP005",
    department: "Public Relations",
    ticket_counter: "Counter 5",
  },
];

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

  return (
    <div className="p-8 mt-6 lg:mt-0 rounded shadow bg-white">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-black">Queue List</h1>
        <Link
          to="/admin/queue/create"
          className="ml-4 bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 flex items-center transition duration-300 ease-in-out"
        >
          <i className="fas fa-plus mr-2"></i>
          <span className="hidden md:inline">Create Queue</span>
        </Link>
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
            {allTickets.rows ? (
              allTickets?.rows.map((queue) => (
                <tr
                  key={queue.id}
                  className="odd:bg-blue-100 even:bg-green-100 border-b border-gray-200"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {queue.user_id}
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

      {/* Delete Modal */}
      {dummyQueues.map((queue) => (
        <div
          key={queue.id}
          className={`fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-30 transition-opacity duration-300 ${
            openModalId === queue.id
              ? "visible opacity-100"
              : "invisible opacity-0"
          }`}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-semibold text-gray-800">
              Are you sure?
            </h2>
            <p className="text-gray-600 mt-2">
              Do you really want to delete this queue? This action cannot be
              undone.
            </p>
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => console.log(`Deleting queue: ${queue.id}`)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ViewTicket;
