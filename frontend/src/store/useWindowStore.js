import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { orderBy } from "natural-orderby";
import { useTicketStore } from "./useTicketStore";
import EditWindow from "../components/DepartmentAdmin_Dashboard/modal/EditWindow";
import { useAuthStore } from "./useAuthStore";

export const useWindowStore = create((set, get) => ({
  windowId: "",
  selectedWindow: null,
  windowTicket: null,
  isWindowUpdate: false,
  dataInProgress: null,
  windowTicketInQueue: null,
  isUpdated: false,

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

      const formattedUsers = sorted
        .map((row) => ({
          users: {
            id: row.users.id,
            firstname: row.users.firstname,
            lastname: row.users.lastname,
            email: row.users.email,
          },
          user_details: {
            id: row.user_details.id,
            age: row.user_details.age,
            phone_number: row.user_details.phone_number,
            city: row.user_details.city,
          },
          window: {
            id: row.window.id,
            ticket_number: row.window.ticket_number,
            service_type: row.window.service_type,
            status: row.window.status,
          },
        }))
        .filter((x) => x.window.status === "In Progress");

      set({ dataInProgress: formattedUsers });
    } catch (error) {
      console.log("Error in getTicketWindows ", error);
      toast.error(
        error.response?.data.message || "Failed to get window details"
      );
    }
  },

  getTicketInQueueWindow: async () => {
    try {
      const { windowId } = get();
      if (!windowId) return;
      const response = await axiosInstance.get(
        `/window/inqueue-number/${windowId}`
      );

      const sorted = orderBy(
        [...response.data],
        [(item) => Number(item.window.ticket_number)], // Convert to Number
        ["asc"]
      );
      set({ windowTicketInQueue: sorted });
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

  setWindow: (dataId) => {
    set({ windowId: dataId });
  },

  subscribeNewTicketWindows: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("tableWindowUpdated");
    socket.on("tableWindowUpdated", (UpdatedTicket) => {
      const sorted = orderBy(
        [...UpdatedTicket],
        [(item) => Number(item.window.ticket_number)], // Convert to Number
        ["asc"]
      );
      set({ windowTicket: sorted });
      const { isUpdated } = get();
      set({ isUpdated: !isUpdated });
    });
  },

  unsubscribeNewTicketWindows: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("tableWindowUpdated");
  },
}));
