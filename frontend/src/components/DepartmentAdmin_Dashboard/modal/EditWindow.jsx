import React, { useEffect } from "react";
import { Pencil, Plus, Save, Trash } from "lucide-react";

const EditWindow = ({
  modalId,
  handleSubmitEdit,
  formEditData,
  setFormEditData,
  selectedWindow,
}) => {
  //   console.log("formEditData: ", formEditData);
  return (
    <div className="modal-box overflow-hidden overflow-y-auto p-5">
      <div className="card-body items-center text-center">
        <h2 className="card-title">
          Edit Window{" "}
          <span className="text-pink-600 font-bold">
            {selectedWindow?.window_number}
          </span>
        </h2>
      </div>
      <form method="dialog" onSubmit={handleSubmitEdit}>
        <div className="flex flex-col gap-4 p-6">
          {/* Input for Counter Name */}
          <div className="w-full max-w-sm min-w-[200px]">
            <label className="block mb-2 text-sm text-pink-700 font-semibold">
              Counter Name
            </label>
            <input
              type="text"
              placeholder="Enter counter name (e.g., Step 1 (Assessment))"
              value={formEditData?.service_type || ""}
              onChange={(e) =>
                setFormEditData({
                  ...formEditData,
                  service_type: e.target.value,
                })
              }
              className="italic w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
            />
          </div>

          {/* Input for Assign Staff Name */}
          <div className="w-full max-w-sm min-w-[200px]">
            <label className="block mb-2 text-sm text-pink-700 font-semibold">
              Assign Staff Name
            </label>
            <input
              type="text"
              placeholder="Enter staff name (e.g., John Doe)"
              value={formEditData?.staff_name || ""}
              onChange={(e) =>
                setFormEditData({ ...formEditData, staff_name: e.target.value })
              }
              className="italic w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
            />
          </div>

          {/* Button to Add Counter */}
          <button
            type="submit"
            disabled={!formEditData?.service_type || !formEditData?.staff_name} // Both inputs must be filled
            className={`w-full rounded-md py-2 px-4 text-sm transition-all duration-300
              ${
                formEditData?.service_type && formEditData?.staff_name
                  ? "bg-pink-800 text-white hover:bg-pink-700"
                  : "bg-gray-400 text-gray-200 cursor-not-allowed"
              }`}
            onClick={() => document.getElementById(modalId).close()}
          >
            {" "}
            Save Changes
          </button>
        </div>

        {/* Close Button */}
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          type="button"
          onClick={() => {
            document.getElementById(modalId).close();
            setFormEditData(selectedWindow);
          }}
        >
          ✕
        </button>
      </form>
    </div>
  );
};

export default EditWindow;
