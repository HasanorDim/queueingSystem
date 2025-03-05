import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useWindowStore = create((set, get) => ({
  windowId: "",
  selectedWindow: null,
  windowTicket: null,

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
      set({ windowTicket: response.data });
    } catch (error) {
      console.log("Error in getTicketWindows ", error);
      toast.error(
        error.response?.data.message || "Failed to get window details"
      );
    }
  },

  setSelectedWindow: (windowId) => {
    set({ windowId });
  },
}));
