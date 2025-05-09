import React, { useEffect, useState } from "react";
import { useTicketStore } from "../../../store/useTicketStore";

const ViewTicket = () => {
  const [openModalId, setOpenModalId] = useState(null);
  const [editModalData, setEditModalData] = useState(null);
  const { getAllTickets, allTickets } = useTicketStore();
  const [isNoTickets, setIsNoTickets] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTickets, setFilteredTickets] = useState([]);

  useEffect(() => {
    getAllTickets();
  }, []);

  useEffect(() => {
    if (allTickets?.rows) {
      const filtered = allTickets.rows.filter((ticket) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          ticket.firstname.toLowerCase().includes(searchLower) ||
          ticket.lastname.toLowerCase().includes(searchLower) ||
          ticket.ticket_number.toString().includes(searchTerm) ||
          ticket.window_number.toString().includes(searchTerm) ||
          ticket.status.toLowerCase().includes(searchLower)
        );
      });
      setFilteredTickets(filtered);
    }
  }, [searchTerm, allTickets]);

  const openModal = (id) => setOpenModalId(id);
  const closeModal = () => setOpenModalId(null);

  const openEditModal = (ticket) => {
    setEditModalData(ticket);
  };

  const closeEditModal = () => {
    setEditModalData(null);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    // Handle edit submission here
    console.log("Edited data:", editModalData);
    closeEditModal();
  };

  return (
    <div className="p-8 mt-6 lg:mt-0 rounded-lg shadow-lg h-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Queue List</h1>

        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i className="fas fa-search text-gray-400"></i>
          </div>
          <input
            type="text"
            placeholder="Search tickets..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <i className="fas fa-times text-gray-400 hover:text-pink-600"></i>
            </button>
          )}
        </div>
      </div>

      <hr className="border-pink-200 my-4" />

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-pink-100">
            <tr>
              <th className="px-6 py-3">User Name</th>
              <th className="px-6 py-3">Queue number</th>
              <th className="px-6 py-3">Counter</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="relative">
            {filteredTickets.length > 0 ? (
              filteredTickets.map((queue, index) => (
                <tr
                  key={index}
                  className="odd:bg-pink-50 even:bg-white border-b border-pink-100 hover:bg-pink-50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {queue.firstname} {queue.lastname}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {queue.ticket_number}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {queue.service_type}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        queue.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : queue.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-pink-100 text-pink-800"
                      }`}
                    >
                      {queue.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => openEditModal(queue)}
                      className="text-pink-600 hover:text-pink-800 font-medium px-3 py-1 rounded hover:bg-pink-100 transition-colors"
                    >
                      <i className="fas fa-edit mr-1"></i> Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center">
                  <div className="text-gray-400 italic font-bold text-lg p-4 bg-pink-50 rounded-lg">
                    {searchTerm
                      ? "No matching tickets found"
                      : "No tickets found"}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editModalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center border-b border-pink-100 p-4 bg-pink-50 rounded-t-lg">
              <h3 className="text-lg font-semibold text-gray-800">
                Edit Ticket
              </h3>
              <button
                onClick={closeEditModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  User Name
                </label>
                <input
                  type="text"
                  value={`${editModalData.firstname} ${editModalData.lastname}`}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-200"
                  disabled
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Ticket Number
                </label>
                <input
                  type="text"
                  value={editModalData.ticket_number}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-200"
                  disabled
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Window Number
                </label>
                <input
                  type="text"
                  value={editModalData.window_number}
                  onChange={(e) =>
                    setEditModalData({
                      ...editModalData,
                      window_number: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-200"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Status
                </label>
                <select
                  value={editModalData.status}
                  onChange={(e) =>
                    setEditModalData({
                      ...editModalData,
                      status: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-200"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium rounded border border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-pink-600 text-white font-medium rounded hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewTicket;
