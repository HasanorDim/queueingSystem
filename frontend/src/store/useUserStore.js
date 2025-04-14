import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useUserStore = create((set, get) => ({
  users: [],
  userCount: null,

  getUsers: async () => {
    try {
      const response = await axiosInstance.get("/user/all-users");
      set({ users: response.data });
    } catch (error) {
      console.log("Error in get users: ", error);
      // toast.error()
    }
  },

  getUsersCounts: async () => {
    try {
      const response = await axiosInstance.get("/user/all-users-count");
      set({ userCount: response.data });
    } catch (error) {
      console.log("Error in get users: ", error);
      // toast.error()
    }
  },
}));
