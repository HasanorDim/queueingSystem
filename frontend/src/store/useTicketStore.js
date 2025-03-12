import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useTicketStore = create((set, get) => ({
  authTicket: null,
  ticket: null,
  isTicketLoading: false,
  queue_num: null,
  totalTickets: 0,
  allTickets: null,
  groupWindows: null,
  isTicketUpdate: false,

  // ticketUpdated: [],

  // setTicketAuth: async (departmentId) => {
  //   try {
  //     await axiosInstance.get(`/ticket/setAuth/${departmentId}`);
  //     // set({ authTicket: response.data });
  //   } catch (error) {
  //     console.log("Error in setTicketAuth: ", error);
  //     toast.error(
  //       error.response.data.message ||
  //         "Failed to check ticket authentication setTicketAuth"
  //     );
  //   }
  // },

  // checkTicketAuth: async () => {
  //   try {
  //     const response = await axiosInstance.get("/ticket/check");
  //     set({ authTicket: response.data });
  //   } catch (error) {
  //     console.log("Error in checkTicketAuth: ", error);
  //     toast.error(
  //       error.response.data.message ||
  //         "Failed to check ticket authentication checkTicketAuth"
  //     );
  //   }
  // },

  checkTicketAuthUser: async () => {
    try {
      const response = await axiosInstance.get("/ticket/user");
      console.log("response: ", response.data);
      set({ ticket: response.data });
    } catch (error) {
      console.log("Error in checkTicketAuth: ", error);
      toast.error(
        error.response.data.message ||
          "Failed to check ticket authentication checkTicketAuth"
      );
    }
  },

  addTicket: async (ticketData) => {
    set({ isTicketLoading: true });
    try {
      const response = await axiosInstance.post("/ticket/add", ticketData);
      set({ ticket: response.data });
      toast.success("Ticket added successfully");
    } catch (error) {
      console.log("Error in addTicket: ", error);
      toast.error(error.response.data.message || "Failed to add Ticket");
    } finally {
      set({ isTicketLoading: false });
    }
  },

  getNewestNumber: async (window_id) => {
    console.log("window_id: ", window_id);
    try {
      const response = await axiosInstance.get(
        `/ticket/newestNumber/${window_id}`
      );
      // set({ tickets: orderBy(response.data.rows, "orderNumber", "asc") });

      set({ queue_num: response.data });
    } catch (error) {
      console.log("Error in getTickets", error);
      toast.error(error.response.data.message || "Failed to get tickets");
    }
  },

  getTicket: async () => {
    try {
      const { ticket } = get();
      if (!ticket) return;
      const response = await axiosInstance.get("/ticket/user");
      set({ ticket: response.data });
    } catch (error) {
      console.log("Error in getTicket", error);
      toast.error(error.response.data.message || "Failed to get ticket");
    }
  },

  setTotalTicket: async () => {
    try {
      const response = await axiosInstance.get("/ticket/all-tickets");
      set({ totalTickets: response.data });
    } catch (error) {
      console.log("Error in getTotalTicket", error);
      toast.error(error.response.data.message || "Failed to get total ticket");
    }
  },

  // Department Admin
  getAllTickets: async () => {
    try {
      const response = await axiosInstance.get("/ticket/department-tickets");
      set({ allTickets: response.data });

      const groupedTickets = response.data.rows.reduce((acc, ticket) => {
        if (!acc[ticket.window_id]) {
          acc[ticket.window_id] = [];
        }
        acc[ticket.window_id].push(ticket);
        return acc;
      }, {});

      set({ groupWindows: groupedTickets });
    } catch (error) {
      console.log("Error in getTotalTicket", error);
      toast.error(error.response.data.message || "Failed to get total ticket");
    }
  },

  addWindow: async (data) => {
    try {
      const { allTickets } = get();
      const response = await axiosInstance.post("/window/add", data);

      // Ensure that response.data is properly assigned to `windows`
      set({
        allTickets: {
          ...allTickets,
          windows: response.data, // Replace `windows` with new data
        },
      });

      toast.success("Department Created Successfully");
    } catch (error) {
      console.log("Error in addWindow", error);
      toast.error("Failed to add department");
    }
  },

  updateTicketStatus: async (ticketId, status) => {
    try {
      // const { allTickets } = get();
      const response = await axiosInstance.post("/ticket/status", {
        ticketId,
        status,
      });

      toast.success("Ticket in progress");
    } catch (error) {
      console.log("Error in addWindow", error);
      toast.error("Failed to update Ticket Status");
    } finally {
      const { isTicketUpdate } = get();
      set({ isTicketUpdate: !isTicketUpdate });
    }
  },
}));
