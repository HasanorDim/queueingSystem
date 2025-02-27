import React from "react";
import { Plus } from "lucide-react";

const AddDepartment = ({
  modalId, // Add modalId prop
  formData,
  setFormData,
  counters,
  setCounters,
  newCounterName,
  setNewCounterName,
  handleSubmit,
  handleAddCounter,
}) => {
  return (
    <div className="modal-box overflow-hidden overflow-y-auto">
      <div className="card-body items-center text-center">
        <h2 className="card-title">Add Department</h2>
      </div>
      <form method="dialog" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 p-6">
          {/* Input for Counter Name */}
          <div className="w-full max-w-sm min-w-[200px]">
            <label className="block mb-2 text-sm text-slate-600">
              Counter Name
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Enter counter name (e.g., Step 1 (Assessment))"
                value={newCounterName}
                onChange={(e) => setNewCounterName(e.target.value)}
                className="italic w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
              />
              <button
                type="button"
                onClick={handleAddCounter}
                className="bg-slate-800 text-white rounded-md px-4 py-2 text-sm hover:bg-slate-700 transition-all duration-300"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Display Counters */}
          <div className="w-full max-w-sm min-w-[200px]">
            <label className="block mb-2 text-sm text-slate-600">
              Counters
            </label>
            <div className="max-h-40 overflow-y-auto">
              <ul className="space-y-2">
                {counters.map((counter) => (
                  <li
                    key={counter.id}
                    className="bg-white p-2 rounded-md border border-slate-200 flex items-center justify-between"
                  >
                    <span>{counter.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Existing Form Fields */}
          <div className="w-full max-w-sm min-w-[200px]">
            <label className="block mb-2 text-sm text-slate-600">
              Department Name
            </label>
            <input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              type="text"
              className="italic w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
              placeholder="Health depart..."
            />
          </div>

          <div className="w-full max-w-sm min-w-[200px]">
            <label className="block mb-2 text-sm text-slate-600">
              Department Descriptions
            </label>
            <input
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              type="text"
              className="italic w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
              placeholder="Department..."
            />
          </div>
          {/* 
          <div className="w-full max-w-sm min-w-[200px]">
            <label className="block mb-2 text-sm text-slate-600">
              No. of Services
            </label>
            <input
              value={formData.services}
              onChange={(e) =>
                setFormData({ ...formData, services: e.target.value })
              }
              readOnly
              type="number"
              className="italic w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
              placeholder="123..."
            />
          </div> */}

          <div className="w-full max-w-sm min-w-[200px]">
            <label className="block mb-2 text-sm text-slate-600">Status</label>
            <input
              value="active"
              type="text"
              disabled
              className="italic w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
              placeholder="active"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="p-6 pt-0">
          <button
            className="btn w-full rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="submit"
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

export default AddDepartment;
