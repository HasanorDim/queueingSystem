import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useTicketStore = create((set, get) => ({
  authTicket: null,
  ticket: null,
  isTicketLoading: false,
  queue_num: null,
  totalTickets: 0,
  totalTicketsSuper: 0,
  allTickets: null,
  groupWindows: null,
  isTicketUpdate: false,
  userTicketDetails: null,
  isStatusUpdated: false,
  isCutOff: false,
  isBreakTime: false,
  calledTicket: null,
  remainingTime: 0,
  intervalId: null,
  voidedTickets: [],
  ticketCount: null,
  otherData: null,
  otherDataSuper: null,

  checkTicketAuthUser: async () => {
    try {
      const response = await axiosInstance.get("/ticket/user");
      set({ ticket: response.data, userTicketDetails: response.data });
      // console.log("Ticket: ", response.data);
    } catch (error) {
      console.log("Error in checkTicketAuth: ", error);
      toast.error(
        error.response.data.message ||
          "Failed to check ticket authentication checkTicketAuth"
      );
    }
  },

  checkTicketUser: async () => {
    try {
      const response = await axiosInstance.get("/ticket/checkUserTicket");
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
      // set({ ticket: response.data });
      toast.success("Ticket added successfully");
    } catch (error) {
      console.log("Error in addTicket: ", error);
      toast.error(error.response.data.message || "Failed to add Ticket");
    } finally {
      set({ isTicketLoading: false });
    }
  },

  getNewestNumber: async (window_id) => {
    try {
      if (!window_id) return;
      const response = await axiosInstance.get(
        `/ticket/newestNumber/${window_id}`
      );

      set({ queue_num: response.data });
    } catch (error) {
      console.log("Error in getTickets", error);
      toast.error(error.response.data.message || "Failed to get tickets");
    }
  },

  getTicket: async () => {
    try {
    } catch (error) {
      console.log("Error in getTicket", error);
      toast.error(error.response.data.message || "Failed to get ticket");
    }
  },

  setTotalTicketByDepartments: async () => {
    try {
      const response = await axiosInstance.get(
        "/ticket/all-tickets-by-departments"
      );
      set({
        totalTickets: response.data.rows,
        ticketCount: response.data.resultCount,
      });
    } catch (error) {
      console.log("Error in getTotalTicket", error);
      toast.error(error.response.data.message || "Failed to get total ticket");
    }
  },

  setTotalTicket: async () => {
    try {
      const response = await axiosInstance.get("/ticket/all-tickets");
      set({
        totalTicketsSuper: response.data,
      });
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

      toast.success("Window Created Successfully");
    } catch (error) {
      console.log("Error in addWindow", error);
      toast.error("Failed to add department");
    }
  },

  updateTicketStatus: async (ticketId, status) => {
    try {
      const response = await axiosInstance.post("/ticket/status", {
        ticketId,
        status,
      });
      const { isStatusUpdated } = get();

      const socket = useAuthStore.getState().socket;
      if (socket && socket.connected) {
        socket.emit("statusUpdated", !isStatusUpdated);
      }
    } catch (error) {
      console.log("Error in addWindow", error);
      toast.error("Failed to update Ticket Status");
    } finally {
      const { isTicketUpdate } = get();
      set({ isTicketUpdate: !isTicketUpdate });
    }
  },

  nextWindowForUser: async (userData) => {
    try {
      await axiosInstance.post("/ticket/nextWindowForUser", userData);
      // set({ queue_num: response.data });
      toast.success("User ticket is set");
    } catch (error) {
      console.log("Error in next window for user ", error);
      toast.error(
        error.response.data.message || "Failed to get next window for user"
      );
    }
  },

  setTicketNotPresent: async (data) => {
    try {
      await axiosInstance.post("/ticket/notPresent", data);
    } catch (error) {
      console.log("Error in setTicketNotPresent: ", error);
      toast.error(
        error.response.data.message || "Failed to set ticket not present"
      );
    }
  },

  getVoidedTickets: async () => {
    try {
      const response = await axiosInstance.post("/ticket/voided"); // Adjust endpoint as needed
      set({ voidedTickets: response.data });
    } catch (error) {
      console.error("Error fetching voided tickets:", error);
    }
  },

  getOtherData: async () => {
    try {
      const response = await axiosInstance.get("/ticket/getFunction");
      set({ otherData: response.data });
    } catch (error) {
      console.log("Error in get Other Data", error);
    }
  },

  getOtherDataSuper: async () => {
    try {
      const response = await axiosInstance.get("/ticket/getFunctionSuper");
      set({ otherDataSuper: response.data });
    } catch (error) {
      console.log("Error in get Other Data", error);
    }
  },

  // releodTime: async () => {
  //   const { ticket, intervalId } = get();

  //   // Clear the existing interval if it exists
  //   if (intervalId) {
  //     clearInterval(intervalId);
  //   }

  //   if (!ticket || !ticket.called_at) return;

  //   // Convert called_at to a timestamp (milliseconds)
  //   const calledAtTimestamp = new Date(ticket.called_at).getTime();

  //   // Calculate remaining time
  //   const remaining = Math.max(
  //     120 - Math.floor((Date.now() - calledAtTimestamp) / 1000),
  //     0
  //   );

  //   set({ remainingTime: remaining });

  //   // Start countdown
  //   const newIntervalId = setInterval(() => {
  //     set((state) => {
  //       const newTime = Math.max(state.remainingTime - 1, 0);
  //       if (newTime === 0) {
  //         clearInterval(newIntervalId);
  //         get().updateTicketStatus(ticket.id, "void");
  //       }
  //       return { remainingTime: newTime };
  //     });
  //   }, 1000);

  //   // Store the new interval ID in the state
  //   set({ intervalId: newIntervalId });
  // },

  setDingSound: async (data) => {
    try {
      const parse = JSON.stringify(data);
      await axiosInstance.get(`/ticket/call-sound/${parse}`);
    } catch (error) {
      console.log("Error from setting the sound ", error);
    }
  },

  editTicket: async (data) => {
    try {
      await axiosInstance.get(`/ticket/edit/`, data);
    } catch (error) {
      console.log("Error from setting the sound ", error);
    }
  },

  subsTicketVoidTimer: async () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("ticketCalled");
    socket.on("ticketCalled", (ticketData) => {
      if (!ticketData.calledAt) return;

      const remaining = Math.max(
        120 - Math.floor((Date.now() - ticketData.calledAt) / 1000),
        0
      );
      set({
        calledTicket: {
          ticketId: ticketData.ticketId,
          calledAt: ticketData.calledAt,
        },
        remainingTime: remaining,
      });

      // Start countdown
      const interval = setInterval(() => {
        set((state) => {
          const newTime = Math.max(state.remainingTime - 1, 0);
          if (newTime === 0) {
            clearInterval(interval);
            // get().updateTicketStatus(ticket.id, "void");
            get().updateTicketStatus(state.calledTicket.ticketId, "void");
          }
          return { remainingTime: newTime };
        });
      }, 1000);
    });
  },

  unsubsTicketVoidTimer: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("ticketCalled");
  },

  subscribeToTicket: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("getNewTicket");
    socket.on("getNewTicket", (newTicket) => {
      const ticket = { new: newTicket.ticket_number + 1 };
      set({ queue_num: ticket });
    });
  },

  unsubscribeToTicket: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("getNewTicket");
  },

  setBreakTime: async () => {
    try {
      const response = await axiosInstance.get("/user/setBreakTime");

      const isBreak = !!response.data.result;

      set({ isBreakTime: isBreak });

      const socket = useAuthStore.getState().socket;
      if (socket && socket.connected) {
        socket.emit("breakTimeStatus", isBreak);
      }
    } catch (error) {
      console.log("Error in get Other Data", error);
    }
  },

  setCutOff: async () => {
    try {
      const response = await axiosInstance.get("/user/setCutOff");

      const isOff = !!response.data.result;

      set({ isCutOff: isOff });

      const socket = useAuthStore.getState().socket;
      if (socket && socket.connected) {
        socket.emit("cutOffStatus", isOff);
      }
    } catch (error) {
      console.log("Error in get Other Data", error);
    }
  },

  getBreakTime: async () => {
    try {
      const response = await axiosInstance.get("/user/getBreakTime");

      const data = !!response?.data.result;
      set({ isBreakTime: data });
    } catch (error) {
      console.log("Error in get Other Data", error);
    }
  },

  getCutOff: async () => {
    try {
      const response = await axiosInstance.get("/user/getCutOff");

      const data = !!response?.data.result;
      set({ isCutOff: data });
    } catch (error) {
      console.log("Error in get Other Data", error);
    }
  },

  subscribeToBreakTime: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("updateBreakTime", (data) => {
      set({ isBreakTime: data });
    });
  },

  // Unsubscribe to prevent memory leaks
  unsubscribeToBreakTime: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("updateBreakTime");
  },

  subscribeToCutOff: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("updateCutOffStatus", (data) => {
      set({ isCutOff: data });
    });
  },

  // Unsubscribe to prevent memory leaks
  unsubscribeToCutOff: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("updateCutOffStatus");
  },

  subsToUpdateStatus: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("updateStatus");
    socket.on("updateStatus", (data) => {
      set({ isStatusUpdated: data });
    });
  },

  // Unsubscribe to prevent memory leaks
  unsubsubsToUpdateStatus: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("updateStatus");
  },
}));
