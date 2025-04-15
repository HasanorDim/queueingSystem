import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { orderBy } from "natural-orderby";

export const useDepartmentStore = create((set, get) => ({
  departments: [],
  isDepartmentLoading: false,
  selectedUser: null,
  selectedDepartment: null,
  serviceWindows: [],
  referenceCount: null,
  reqUserDepartment: null,
  isAddingDep: false,

  addDepartment: async (data) => {
    try {
      set({ isAddingDep: true });
      const { departments } = get();
      const response = await axiosInstance.post("/department/add", data);
      const sorted = orderBy(
        [...departments, response.data],
        ["created_at"],
        ["desc"]
      );
      set({ departments: sorted });
      toast.success("Department Created Successfully");
    } catch (error) {
      console.log("Error in addDepartment", error);
      toast.error("Failed to add department");
    } finally {
      set({ isAddingDep: false });
    }
  },

  editDepartment: async (data) => {
    try {
      const { departments } = get();
      const response = await axiosInstance.put("/department/edit", data);

      set({
        departments: departments.map((dept) =>
          dept.id === data.id ? { ...dept, ...response.data } : dept
        ),
      });

      toast.success("Department edited successfully");
    } catch (error) {
      console.log("Error in editDepartment", error);
      toast.error("Failed to edit department");
    }
  },

  getAllDepartments: async () => {
    try {
      set({ isDepartmentLoading: true });
      const response = await axiosInstance.get("/department/all");
      const sorted = orderBy(response.data, ["created_at"], ["desc"]);
      set({ departments: sorted, departmentCount: sorted.length });
    } catch (error) {
      console.log("Error in getDepartments", error);
    } finally {
      set({ isDepartmentLoading: false });
    }
  },

  getDepartment: async () => {
    try {
      const { selectedUser } = get();
      if (!selectedUser) return;
      const response = await axiosInstance.get(
        `/department/${selectedUser.id}`
      );
      set({ selectedUser: response.data });
    } catch (error) {
      console.log("Error in getDepartment", error);
      toast.error("Failed to get department");
    }
  },

  deleteDepartment: async (departmentId) => {
    try {
      await axiosInstance.delete(`/department/delete/${departmentId}`);
      const { departments } = get();
      const index = departments.findIndex((d) => d.id === departmentId);
      if (index === -1) return;

      const updatedDepartments = [
        ...departments.slice(0, index),
        ...departments.slice(index + 1),
      ];
      set({ departments: updatedDepartments });

      toast.success("Department deleted successfully");
    } catch (error) {
      console.log("Error in deleting department", error);
      toast.error("Failed to delete department");
    }
  },

  generateQR: async (departmentID) => {
    try {
      const response = await axiosInstance.get(`/qr/${departmentID}`);
      set({ departments: response.data });

      const { departments } = get();
      const { selectedUser } = get();

      const index = departments.findIndex((d) => d.id === selectedUser.id);
      if (index === -1) return;

      const selectedItem = departments.slice(index, index + 1);
      set({ selectedUser: selectedItem[0] });
      // toast.success("QR code generated successfully");
    } catch (error) {
      console.log("Error in generate QR", error);
      toast.error(error.response.data.message || "Failed to generate QR");
    }
  },

  setSelectedUser: async (selectedUser) => {
    set({ selectedUser });
  },

  setSelectedDepartment: async (dataId) => {
    if (!dataId) return;
    try {
      const response = await axiosInstance.get(
        `/department/service-window/${dataId}`
      );

      if (!response.data || response.data.length === 0) {
        console.error("No service windows returned!");
        return;
      }
      set({ selectedDepartment: dataId, serviceWindows: response.data });
    } catch (error) {
      console.log("Error in setselected user ", error);
      toast.error(
        error.response?.data?.message || "Failed to get service window"
      );
    }
  },

  setUserDepartment: async (data) => {
    try {
      console.log("Data: ", data);
      const { selectedUser } = get();
      if (!selectedUser) return;
      await axiosInstance.post(
        `/department/set-department-user/${selectedUser.id}`,
        data
      );
      toast.success("Department's user set successfully");
      return { email: "", password: "", confirmpass: "" };
    } catch (error) {
      console.log("Error in setUserDepartment", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to set user's setUserDepartment"
      );
    }
  },

  getUserDepartment: async () => {
    try {
      const response = await axiosInstance.get("/department/deptuser");
      set({ reqUserDepartment: response.data });
    } catch (error) {
      console.log("Error in getUserDepartment", error);
      toast.error(
        // error.response?.data?.message ||
        "Failed to set user's setUserDepartment123"
      );
    }
  },

  getDepartmenthelperfunctions: async () => {
    try {
      const response = await axiosInstance.get("/department/helper");
      set({ referenceCount: response.data });
    } catch (error) {
      console.log("Error in getDepartmenthelperfunctions ", error);
      toast.error(error.response?.data?.message || "Failed to fetch Data");
    }
  },
}));
