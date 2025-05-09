import React, { useEffect, useState } from "react";
import { useTicketStore } from "../../store/useTicketStore";
import { useDepartmentStore } from "../../store/useDepartmentStore";
import { useNavigate } from "react-router-dom";
import Window from "../../components/usermodal/Window";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/useAuthStore";
import CutOff from "../../components/usermodal/CutOff";
import {
  FaTicketAlt,
  FaDesktop,
  FaCheckCircle,
  FaWheelchair,
  FaBaby,
  FaUserAlt,
} from "react-icons/fa";

const Ticket = () => {
  const navigate = useNavigate();

  const {
    addTicket,
    queue_num,
    getNewestNumber,
    subscribeToTicket,
    unsubscribeToTicket,
    unsubscribeToCutOff,
    subscribeToCutOff,
    getCutOff,
    isCutOff,
  } = useTicketStore();

  const { serviceWindows, setSelectedDepartment } = useDepartmentStore();
  const { socket } = useAuthStore();

  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isPriorityModalOpen, setIsPriorityModalOpen] = useState(false);
  const [priorityType, setPriorityType] = useState(null);
  const [formData, setFormData] = useState({
    number: 0,
    windowId:
      (serviceWindows.window || []).length > 0
        ? serviceWindows.window[0].id
        : "",
    status: "waiting",
    service_type: "",
    window_number: null,
    priority: null,
  });

  useEffect(() => {
    subscribeToTicket();
    subscribeToCutOff();
    return () => {
      unsubscribeToTicket();
      unsubscribeToCutOff();
    };
  }, [socket]);

  useEffect(() => {
    const departmentId = localStorage.getItem("departmentId");
    setSelectedDepartment(departmentId);
    getCutOff();
  }, []);

  useEffect(() => {
    if (serviceWindows?.window.length === 1) {
      handleSelectWindow(serviceWindows.window[0]);
      getNewestNumber(serviceWindows.window[0].id);
    }
  }, [serviceWindows]);

  const handleSelectWindow = (window) => {
    setFormData((prev) => ({
      ...prev,
      windowId: window.id,
      window_number: window.window_number,
      service_type: window.service_type,
    }));
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.window_number) {
      toast.error("Please select a window before proceeding.");
      return;
    }
    setIsPriorityModalOpen(true);
  };

  const confirmWithPriority = async () => {
    try {
      const finalData = {
        ...formData,
        number: queue_num.new,
        priority: priorityType,
      };

      await addTicket(finalData);
      localStorage.removeItem("departmentId");
      navigate("/user/ticket");
      toast.success("Ticket submitted successfully!");
    } catch (error) {
      console.error("Error adding ticket:", error);
      toast.error("Failed to add ticket. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 p-4">
      {/* Window Selection Modal */}
      {isCutOff ? (
        <CutOff />
      ) : (
        serviceWindows?.window.length > 1 && (
          <Window
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              navigate("/userpage");
            }}
            onSelect={handleSelectWindow}
            serviceWindows={serviceWindows}
          />
        )
      )}

      {/* Priority Assistance Modal */}
      {isPriorityModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 bg-transparent">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-pink-200">
            <div className="bg-pink-500 p-4 text-center">
              <h2 className="text-xl font-bold text-white">
                Priority Assistance
              </h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-6 text-center">
                Please select if you qualify for priority service:
              </p>

              <div className="grid grid-cols-1 gap-3 mb-6">
                <button
                  className={`flex items-center gap-3 p-4 rounded-lg border ${
                    priorityType === "pwd"
                      ? "border-pink-500 bg-pink-50"
                      : "border-gray-200"
                  }`}
                  onClick={() => setPriorityType("pwd")}
                >
                  <FaWheelchair
                    className={`text-xl ${
                      priorityType === "pwd" ? "text-pink-600" : "text-gray-400"
                    }`}
                  />
                  <span className="font-medium">
                    Person with Disability (PWD)
                  </span>
                </button>

                <button
                  className={`flex items-center gap-3 p-4 rounded-lg border ${
                    priorityType === "pregnant"
                      ? "border-pink-500 bg-pink-50"
                      : "border-gray-200"
                  }`}
                  onClick={() => setPriorityType("pregnant")}
                >
                  <FaBaby
                    className={`text-xl ${
                      priorityType === "pregnant"
                        ? "text-pink-600"
                        : "text-gray-400"
                    }`}
                  />
                  <span className="font-medium">Pregnant</span>
                </button>

                <button
                  className={`flex items-center gap-3 p-4 rounded-lg border ${
                    priorityType === "senior"
                      ? "border-pink-500 bg-pink-50"
                      : "border-gray-200"
                  }`}
                  onClick={() => setPriorityType("senior")}
                >
                  <FaUserAlt
                    className={`text-xl ${
                      priorityType === "senior"
                        ? "text-pink-600"
                        : "text-gray-400"
                    }`}
                  />
                  <span className="font-medium">Senior Citizen</span>
                </button>

                <button
                  className={`flex items-center gap-3 p-4 rounded-lg border ${
                    priorityType === "none"
                      ? "border-pink-500 bg-pink-50"
                      : "border-gray-200"
                  }`}
                  onClick={() => setPriorityType("none")}
                >
                  <span
                    className={`text-xl ${
                      priorityType === "none"
                        ? "text-pink-600"
                        : "text-gray-400"
                    }`}
                  >
                    —
                  </span>
                  <span className="font-medium">No Priority</span>
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg font-medium transition-colors"
                  onClick={() => setIsPriorityModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                  onClick={confirmWithPriority}
                  disabled={!priorityType}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Ticket Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-rose-200">
          <div className="bg-pink-500 p-4 text-center">
            <div className="inline-flex items-center justify-center bg-white/20 p-3 rounded-full">
              <FaTicketAlt className="text-white text-2xl" />
            </div>
            <h2 className="text-xl font-bold text-white mt-2">
              Your Queue Ticket
            </h2>
          </div>

          <div className="p-6">
            <div className="mb-6 text-center">
              <div className="text-sm font-medium text-gray-500 mb-1">
                Department
              </div>
              <div className="text-lg font-semibold text-pink-700">
                {serviceWindows.name}
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <div className="text-left">
                <div className="text-sm font-medium text-gray-500">
                  {serviceWindows?.window.length > 1 ? "Window" : "Default"}
                </div>
                <div className="text-lg font-semibold">
                  {formData.window_number || (
                    <span className="text-gray-400">Not selected</span>
                  )}
                </div>
                <div className="text-sm text-pink-600 font-medium">
                  {formData.service_type}
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-medium text-gray-500">
                  Queue Number
                </div>
                <div className="text-4xl font-extrabold text-pink-600">
                  {queue_num?.new || "—"}
                </div>
              </div>
            </div>

            <div className="flex items-center bg-pink-100 rounded-lg p-3 text-sm text-pink-700 mb-6">
              <FaDesktop className="mr-2 flex-shrink-0" />
              <span>Please proceed to your selected window when called</span>
            </div>

            <button
              className="w-full flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white py-3 px-4 rounded-lg font-semibold shadow-sm transition-colors"
              type="submit"
            >
              <FaCheckCircle />
              Confirm Ticket
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Ticket;
