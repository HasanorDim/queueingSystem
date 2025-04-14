import React from "react";
import { Pencil, Plus, Save, Trash } from "lucide-react";

const AddWindow = ({
  modalId,
  counters,
  newCounterName,
  newStaffName, // Added staff input state
  editedCounterName,
  editedStaffName, // Added staff editing state
  setNewCounterName,
  setNewStaffName, // Added setter for staff
  editingCounterId,
  setEditedCounterName,
  setEditedStaffName, // Added setter for edited staff name
  handleSaveCounter,
  handleEditCounter,
  handleSubmit,
  handleDeleteCounter,
  handleAddCounter,
  onEditChange,
}) => {
  return (
    <div className="modal-box overflow-hidden overflow-y-auto p-5">
      <div className="card-body items-center text-center">
        <h2 className="card-title">Add Department Window</h2>
      </div>
      <form method="dialog" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 p-6">
          {/* Input for Counter Name */}
          <div className="w-full max-w-sm min-w-[200px]">
            <label className="block mb-2 text-sm text-slate-600">
              Counter Name
            </label>
            <input
              type="text"
              placeholder="Enter counter name (e.g., Step 1 (Assessment))"
              value={newCounterName}
              onChange={(e) => setNewCounterName(e.target.value)}
              className="italic w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
            />
          </div>

          {/* Input for Assign Staff Name */}
          <div className="w-full max-w-sm min-w-[200px]">
            <label className="block mb-2 text-sm text-slate-600">
              Assign Staff Name
            </label>
            <input
              type="text"
              placeholder="Enter staff name (e.g., John Doe)"
              value={newStaffName}
              onChange={(e) => setNewStaffName(e.target.value)}
              className="italic w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
            />
          </div>

          {/* Button to Add Counter */}
          <button
            type="button"
            onClick={handleAddCounter}
            disabled={!newCounterName.trim() || !newStaffName.trim()} // Both inputs must be filled
            className={`w-full rounded-md py-2 px-4 text-sm transition-all duration-300
              ${
                newCounterName.trim() && newStaffName.trim()
                  ? "bg-pink-800 text-white hover:bg-pink-700"
                  : "bg-gray-400 text-gray-200 cursor-not-allowed"
              }`}
          >
            <Plus className="w-4 h-4 inline-block mr-2" /> Add More Counters
          </button>

          {/* Display Counters with Staff */}
          <div className="w-full max-w-sm min-w-[200px]">
            <label className="block mb-2 text-sm text-slate-600">
              Counters
            </label>
            <div className="max-h-40 overflow-y-auto">
              <ul className="space-y-2">
                {counters.map((counter) => {
                  const isEditing = editingCounterId === counter.id;

                  return (
                    <li
                      key={counter.id}
                      className="bg-white p-2 rounded-md border border-slate-200 flex flex-col space-y-1"
                    >
                      {/* Counter Name */}
                      <div className="flex items-center justify-between">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedCounterName}
                            onChange={(e) =>
                              setEditedCounterName(e.target.value)
                            }
                            className="italic w-full bg-transparent text-slate-700 text-sm border border-slate-200 rounded-md px-2 py-1 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                          />
                        ) : (
                          <span className="font-medium">{counter.name}</span>
                        )}

                        <div className="flex items-center gap-2">
                          {isEditing ? (
                            <button
                              onClick={() => handleSaveCounter(counter.id)}
                              className="text-green-600 hover:text-green-700"
                              type="button"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                handleEditCounter(
                                  counter.id,
                                  counter.name,
                                  counter.staff
                                )
                              }
                              className="text-blue-600 hover:text-blue-700"
                              type="button"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteCounter(counter.id)}
                            className="text-red-600 hover:text-red-700"
                            type="button"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Staff Name */}
                      <div className="text-sm text-slate-500">
                        {isEditing ? (
                          <div>
                            <input
                              type="text"
                              value={editedStaffName}
                              onChange={(e) =>
                                setEditedStaffName(e.target.value)
                              }
                              className="italic w-full bg-transparent text-slate-700 text-sm border border-slate-200 rounded-md px-2 py-1 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                            />
                          </div>
                        ) : (
                          `Assigned Staff: ${counter.staff}`
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-6 pt-0">
          <button
            className={`w-full rounded-md py-2 px-4 border transition-all duration-300 shadow-md flex justify-center align-middle
      ${
        counters.length > 0
          ? "bg-pink-800 text-white hover:bg-pink-700"
          : "bg-gray-900 text-blue-400 cursor-not-allowed opacity-50"
      }`}
            type="submit"
            disabled={counters.length === 0}
            onClick={() => document.getElementById(modalId).close()}
          >
            <Plus /> Add Details
          </button>
        </div>

        {/* Close Button */}
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          type="button"
          onClick={() => document.getElementById(modalId).close()}
        >
          ✕
        </button>
      </form>
    </div>
  );
};

export default AddWindow;
