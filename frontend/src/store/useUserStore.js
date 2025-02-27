import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useUserStore = create((set, get) => ({
  users: [],

  getUsers: async () => {
    try {
      const response = await axiosInstance.get("/user/all-users");
      set({ users: response.data });
    } catch (error) {
      console.log("Error in get users: ", error);
      // toast.error()
    }
  },
}));
