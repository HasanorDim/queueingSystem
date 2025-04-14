import React, { useState, useEffect } from "react";
import { Pencil, Plus, QrCode, Trash2 } from "lucide-react";
import { useWindowStore } from "../../../../store/useWindowStore";
import { useTicketStore } from "../../../../store/useTicketStore";
import Department from "../../modal/Department";
import DeleteModal from "../../modal/DeleteModal";

const ManageWindow = () => {
  const { setSelectedWindow, isWindowUpdate } = useWindowStore();
  const { getAllTickets, allTickets, groupWindows } = useTicketStore();
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    getAllTickets();
  }, [isWindowUpdate]);

  return (
    <div>
      <div className="flex justify-end p-4">
        <Plus
          className="btn mr-4 bg-pink-500 text-white rounded-full px-2 w-10 h-4 hover:bg-pink-700"
          onClick={() => {
            document.getElementById("Modal_Window").showModal();
            setEdit(false);
          }}
        />
      </div>

      <div className="flex justify-center items-center dark:bg-gray-800 min-h-full w-full p-4">
        <div className="flex flex-wrap justify-center gap-5">
          {allTickets?.windows.map((counter) => (
            <div
              key={counter.id}
              className="bg-pink-50 rounded-xl p-10 border border-pink-300 transition hover:shadow-2xl"
            >
              {/* <h3 className="text-2xl font-bold text-pink-800 mb-2">
                Counter #{counter.window_number}
              </h3> */}

              <h3 className="text-2xl font-bold text-pink-800 mb-2">
                {counter.service_type}
              </h3>

              {/* <h2 className="text-xl font-bold text-pink-800 mb-4">
                {counter.service_type}
              </h2> */}
              <p className="text-pink-700 mt-1">
                🎟 Tickets:{" "}
                <span className="font-bold">
                  {groupWindows[counter.id]?.length || 0}
                </span>
              </p>
              <p className="text-pink-700 mt-1">
                👨‍💼 Staff:{" "}
                <span className="font-medium text-pink-900">
                  {counter.staff_name ?? "Not Assigned"}
                </span>
              </p>

              <div className="mt-5 flex space-x-3">
                {[
                  {
                    label: "Edit",
                    icon: <Pencil className="w-4" />,
                    onClick: () => {
                      document.getElementById("Modal_Window").showModal();
                      setSelectedWindow(counter);
                      setEdit(true);
                    },
                  },
                  {
                    label: "Delete",
                    icon: <Trash2 className="w-4" />,
                    onClick: () => {
                      document.getElementById("Modal_DeleteWindow").showModal();
                      setSelectedWindow(counter.id);
                    },
                  },
                ].map((btn, index) =>
                  allTickets?.windows.length <= 1 ? (
                    btn.label !== "Delete" ? (
                      <button
                        key={index}
                        onClick={btn.onClick}
                        className="flex gap-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg shadow-md transition items-center justify-center px-4 py-2"
                      >
                        {btn.icon} {btn.label}
                      </button>
                    ) : null
                  ) : (
                    <button
                      key={index}
                      onClick={btn.onClick}
                      className="flex gap-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg shadow-md transition items-center justify-center px-4 py-2"
                    >
                      {btn.icon} {btn.label}
                    </button>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Department modalId={"Modal_Window"} onEditChange={edit} />
      <DeleteModal modalId={"Modal_DeleteWindow"} />
    </div>
  );
};

export default ManageWindow;
