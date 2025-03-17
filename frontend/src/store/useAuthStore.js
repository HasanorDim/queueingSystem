import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLogingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  socket: null,

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/check");
      set({ authUser: response.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    try {
      set({ isSigningUp: true });
      const response = await axiosInstance.post("/auth/signup", data);
      set({ authUser: response.data });
      toast.success("Account Created Successfully");
    } catch (error) {
      console.log("Error in signup Auth Store", error);
      toast.error("Failed to signup");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    try {
      set({ isLogingIn: true });
      const response = await axiosInstance.post("/auth/login", data);
      set({ authUser: response.data });
      const { authUser } = get();
      if (authUser.is_user_info_set === 0) {
        toast.success("User logged in");
      } else {
        toast.success("Logged In Successfully");
      }
    } catch (error) {
      console.log("Error in login Auth Store", error);
      toast.error(error.response?.data.message || "Failed to login");
    } finally {
      set({ isLogingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
    } catch (error) {
      console.log("Error in logout");
      toast.error("Failed to logout");
    }
  },
  setUSerInfo: async (infoData) => {
    try {
      const response = await axiosInstance.post("/auth/set-info", infoData);
      set({ authUser: response.data });
      toast.success("User logged in");
      toast.success("User informations set successfully");
    } catch (error) {
      console.log("Error in logout");
      toast.error(
        error.response.data.message || "Failed to set user informations"
      );
    }
  },

  // Socket
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;
    const socket = io(BASE_URL, {
      query: {
        userId: authUser.id,
      },
    });
    socket.connect();
    set({ socket: socket });
  },
}));
