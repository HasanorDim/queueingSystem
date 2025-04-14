import { Plus, ScanQrCode } from "lucide-react";
import React, { useEffect } from "react";
// import CreateUserDepartment from "../MainContent/CreateUserDepartment";
import { useNavigate } from "react-router-dom";

import { useDepartmentStore } from "../../../store/useDepartmentStore";

const ViewDepartment = ({ modalId, headText }) => {
  const { selectedUser, generateQR } = useDepartmentStore();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedUser || !selectedUser.id) {
      console.error("Error: selectedUser or selectedUser.id is missing!");
      return; // Stop execution if selectedUser is not valid
    }
    // generateQR(selectedUser.id);
  };

  return (
    <>
      <dialog id={modalId} className="modal">
        <div className="modal-box">
          <div className="sticky top-0 right-0 z-50">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-0 top-0"
              type="button"
              onClick={() => document.getElementById(modalId).close()}
            >
              ✕
            </button>
          </div>
          <div className="card-body items-center text-center">
            <h2 className="card-title">{headText}</h2>

            {/* Is user Set or not  */}
            {selectedUser && selectedUser.has_user === 1 ? (
              <div className="bg-green-300 text-gray-700 px-4 py-2 rounded-lg cursor-not-allowed">
                Department Account Set
              </div>
            ) : (
              <button
                className="btn bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition"
                onClick={() => navigate("/dashboard/set-user-department")}
              >
                Set User Department
              </button>
            )}
          </div>
          <form method="dialog overflow-auto" onSubmit={handleSubmit}>
            <div className="flex flex-1 justify-center items-center">
              {selectedUser && (
                <div className="flex flex-col gap-4 p-6 w-full">
                  {/* Name */}
                  <div className="w-full max-w-sm min-w-[200px]">
                    <label className="block mb-2 text-sm text-slate-600">
                      Name
                    </label>
                    <div className="text-sm border border-slate-400 rounded-md px-3 py-2 transition duration-300 shadow-md">
                      <p className="text-slate-600">
                        {selectedUser.name || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="w-full max-w-sm min-w-[200px]">
                    <label className="block mb-2 text-sm text-slate-600">
                      Description
                    </label>
                    <div className="text-sm border border-slate-400 rounded-md px-3 py-2 transition duration-300 shadow-md">
                      <p className="text-slate-600">
                        {selectedUser.description || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Total Services */}
                  <div className="w-full max-w-sm min-w-[200px]">
                    <label className="block mb-2 text-sm text-slate-600">
                      Total Services
                    </label>
                    <div className="text-sm border border-slate-400 rounded-md px-3 py-2 transition duration-300 shadow-md">
                      <p className="text-slate-600">
                        {selectedUser.service_total || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="w-full max-w-sm min-w-[200px]">
                    <label className="block mb-2 text-sm text-slate-600">
                      Status
                    </label>
                    <div className="text-sm border border-slate-400 rounded-md px-3 py-2 transition duration-300 shadow-md">
                      <p className="text-slate-600">
                        {selectedUser.status || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Counters List */}
                  {selectedUser?.counters &&
                  selectedUser.counters.length > 0 ? (
                    <div className="w-full max-w-sm min-w-[200px]">
                      <label className="block mb-2 text-sm text-slate-600">
                        Counters
                      </label>
                      <div className="text-sm border border-slate-400 rounded-md px-3 py-2 transition duration-300 shadow-md">
                        {selectedUser.counters.map((counter, index) => (
                          <div key={counter.id} className="flex gap-5">
                            <span>W - {index + 1}</span>
                            {"("}
                            <p className="text-slate-600">
                              {counter.name || "Unnamed Counter"}
                            </p>
                            {")"}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="w-full max-w-sm min-w-[200px] flex flex-1 flex-col">
                      <label className="block mb-2 text-sm text-center text-gray-400 italic">
                        List of counters here...
                      </label>
                    </div>
                  )}

                  {/* QR Code Display */}
                  {selectedUser.qr_code ? (
                    <div className="w-full max-w-sm min-w-[200px] flex flex-1 flex-col">
                      <label className="block mb-2 text-sm text-slate-600">
                        QR Code
                      </label>
                      <div className="text-sm border border-slate-400 rounded-md px-3 py-2 transition duration-300 shadow-md flex justify-center">
                        <img
                          className="w-48 h-auto"
                          src={selectedUser.qr_code}
                          alt="QRCode"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="w-full max-w-sm min-w-[200px] flex flex-1 flex-col">
                      <label className="block mb-2 text-sm text-center text-red-400">
                        No QRCode
                      </label>
                    </div>
                  )}

                  {/* Generate QR Code Button */}
                  {!selectedUser.qr_code && (
                    <button
                      className="btn w-full rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                      type="submit"
                    >
                      <ScanQrCode /> Generate QR Code
                    </button>
                  )}
                </div>
              )}
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default ViewDepartment;
