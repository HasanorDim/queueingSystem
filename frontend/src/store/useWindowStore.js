import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { orderBy } from "natural-orderby";
import { useTicketStore } from "./useTicketStore";
import EditWindow from "../components/DepartmentAdmin_Dashboard/modal/EditWindow";

export const useWindowStore = create((set, get) => ({
  windowId: "",
  selectedWindow: null,
  windowTicket: null,
  isWindowUpdate: false,

  getWindowDetails: async () => {
    try {
      const { windowId } = get();
      if (!windowId) return;
      const response = await axiosInstance.get(`/window/${windowId}`);
      set({ selectedWindow: response.data });
    } catch (error) {
      console.log("Error in getWindow ", error);
      toast.error(
        error.response?.data.message || "Failed to get window details"
      );
    }
  },

  getTicketWindows: async () => {
    try {
      const { windowId } = get();
      if (!windowId) return;
      const response = await axiosInstance.get(`/window/table/${windowId}`);

      const sorted = orderBy(
        [...response.data],
        [(item) => Number(item.window.ticket_number)], // Convert to Number
        ["asc"]
      );
      set({ windowTicket: sorted });
    } catch (error) {
      console.log("Error in getTicketWindows ", error);
      toast.error(
        error.response?.data.message || "Failed to get window details"
      );
    }
  },

  editWindow: async (data) => {
    try {
      const response = await axiosInstance.put("/window/edit", data);
      toast.success(response.data.message || "Updated");
    } catch (error) {
      console.log("Error in editDepartment", error);
      toast.error("Failed to edit department");
    } finally {
      const { isWindowUpdate } = get();
      set({ isWindowUpdate: !isWindowUpdate });
    }
  },

  deleteWindow: async (windowId) => {
    try {
      const response = await axiosInstance.delete(`/window/delete/${windowId}`);
      toast.success(response.data.message || "Error in deleting window");
    } catch (error) {
      console.log("Error in editDepartment", error);
      toast.error("Failed to edit department");
    } finally {
      const { isWindowUpdate } = get();
      set({ isWindowUpdate: !isWindowUpdate });
    }
  },

  setSelectedWindow: (dataWindow) => {
    set({ selectedWindow: dataWindow, windowId: dataWindow.id });
  },
}));
