import React from "react";
import { useTicketStore } from "../../store/useTicketStore";
import {
  FaUserMd,
  FaMoneyBillWave,
  FaHeadset,
  FaCogs,
  FaTimes,
  FaLaptopMedical,
} from "react-icons/fa";

const Window = ({ isOpen, onClose, onSelect, serviceWindows }) => {
  if (!isOpen) return null;
  if (!serviceWindows) return null;

  const { getNewestNumber } = useTicketStore();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-200 to-pink-100 p-5 flex justify-between items-center border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            Available Service Points
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Window List */}
        <div className="p-5 space-y-3 max-h-[60vh] overflow-y-auto">
          {serviceWindows?.window?.map((num) => (
            <button
              key={num.id}
              className="w-full flex items-center gap-4 p-4 rounded-xl bg-white hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:border-blue-200 border border-pink-200"
              onClick={() => {
                onSelect(num);
                getNewestNumber(num.id);
              }}
            >
              <div className="flex-shrink-0 p-3 rounded-lg bg-pink-100 text-lg">
                <FaLaptopMedical className="text-pink-500" />
              </div>
              <div className="text-left flex-grow">
                <p className="font-semibold text-gray-800">
                  {num.service_type}
                </p>
                <p className="text-sm text-gray-500">#{num.window_number}</p>
              </div>
              <div className="text-white bg-pink-500 hover:bg-pink-600 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
                Select
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        {/* <div className="bg-pink-50 p-4 border-t border-pink-200">
          <button
            className="w-full py-2.5 text-gray-600 hover:text-gray-800 transition-colors font-medium text-sm"
            onClick={onClose}
          >
            Close Panel
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default Window;
