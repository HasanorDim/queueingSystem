import React from "react";
import { useDepartmentStore } from "../../store/useDepartmentStore";
import { useTicketStore } from "../../store/useTicketStore";

const Window = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  const { getNewestNumber } = useTicketStore();
  const { serviceWindows } = useDepartmentStore();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Select a Window
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {serviceWindows?.window?.map((num) => (
            <button
              key={num.id}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md"
              onClick={() => {
                onSelect(num);
                getNewestNumber(num.id);
              }}
            >
              W{num.window_number} - {num.service_type}
            </button>
          ))}
        </div>
        <button
          className="mt-4 w-full bg-gray-500 text-white px-4 py-2 rounded-lg shadow-md"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Window;
