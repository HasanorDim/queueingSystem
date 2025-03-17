import React, { useEffect, useState } from "react";
import { useTicketStore } from "../../store/useTicketStore";
import { useDepartmentStore } from "../../store/useDepartmentStore";
import { useNavigate } from "react-router-dom";
import Window from "../../components/usermodal/Window";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/useAuthStore";

const Ticket = () => {
  const navigate = useNavigate();

  const {
    addTicket,
    queue_num,
    getNewestNumber,
    subscribeToTicket,
    unsubscribeToTicket,
  } = useTicketStore();
  const { serviceWindows, setSelectedDepartment } = useDepartmentStore();

  const { socket } = useAuthStore();

  const [isModalOpen, setIsModalOpen] = useState(true); // Show modal initially
  const [formData, setFormData] = useState({
    number: 0,
    // department_id: selectedDepartment,
    windowId:
      (serviceWindows.window || []).length > 0
        ? serviceWindows.window[0].id
        : "",
    status: "waiting",
    service_type: "",
    window_number: null, // Track the selected window
  });
  useEffect(() => {
    subscribeToTicket();
    return () => unsubscribeToTicket();
  }, [socket]);

  useEffect(() => {
    const departmentId = localStorage.getItem("departmentId");
    setSelectedDepartment(departmentId);
    // getNewestNumber(
    //   (serviceWindows.window || []).length > 0
    //     ? serviceWindows.window[0].id
    //     : ""
    // );
  }, []);

  const handleSelectWindow = (window) => {
    setFormData((prev) => ({
      ...prev,
      windowId: window.id,
      window_number: window.window_number,
      service_type: window.service_type,
    }));
    setIsModalOpen(false); // Close modal after selection
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.window_number) {
      alert("Please select a window before proceeding.");
      return;
    }

    try {
      setFormData((prevFormData) => ({
        ...prevFormData,
        number: queue_num.new,
      }));

      await addTicket(formData);
      localStorage.removeItem("departmentId");

      navigate("/user/ticket");
    } catch (error) {
      console.error("Error adding ticket:", error);
      toast.error("Failed to add ticket. Please try again.");
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {/* Window Selection Modal */}
      <Window
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleSelectWindow}
        serviceWindows={serviceWindows}
      />

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-2xl shadow-lg p-6 w-80 text-center border-2 border-blue-500">
          <h2 className="text-xl font-bold text-gray-800">🎟️ Your Ticket</h2>
          <div className="mt-2 text-gray-600 text-sm">Department</div>
          <div className="text-lg font-semibold text-blue-700">
            {serviceWindows.name}
          </div>

          <div className="mt-4 text-gray-600 text-sm">Queue Number</div>
          <div className="text-5xl font-extrabold text-blue-600">
            <input
              className="w-full text-center outline-none"
              type="number"
              value={queue_num?.new || ""}
              readOnly
            />
          </div>

          <div className="mt-2 text-gray-500 text-xs">
            Window- {formData.window_number || "Not Selected"}
            <p className="font-bold text-lg">{formData.service_type}</p>
          </div>
          <hr className="my-4 border-gray-300" />

          <p className="text-gray-700 text-sm">
            {/* Please wait for your turn. Stay in the queue. */}
          </p>

          <button
            className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg text-sm font-semibold shadow-md hover:bg-green-700 transition"
            type="submit"
          >
            Confirm Ticket Number
          </button>
        </div>
      </form>
    </div>
  );
};

export default Ticket;
