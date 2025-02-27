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
  departmentCount: 0,

  addDepartment: async (data) => {
    try {
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
    }
  },

  editDepartment: async (data) => {
    try {
      const { departments } = get();
      const response = await axiosInstance.put("/department/edit", data);

      // Update only the edited department in the state

      // const { department, counters } = response.data;

      // Update only the edited department in the state, including counters
      // set({
      //   departments: departments.map((dept) =>
      //     dept.id === department.id ? { ...department, counters } : dept
      //   ),
      // });

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
      const { departments } = get();

      await axiosInstance.delete(`/department/delete/${departmentId}`);

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

  // setEditCounter: async (data) => {
  //   try {
  //     const { departments } = get();
  //     const departmentId = departments.id;
  //     const response = await axiosInstance.put(
  //       `/edit-counter/${departmentId}`,
  //       data
  //     );
  //   } catch (error) {
  //     console.log("Error in setEditCounter: ", error);
  //     toast.error(
  //       error.response.data.message ||
  //         "Failed to set edit counter setEditCounter"
  //     );
  //   }
  // },

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

      console.log("Service windows before set: ", response.data); // Debugging check
      set({ selectedDepartment: dataId, serviceWindows: response.data });

      const { selectedDepartment } = get();
      console.log("selectedDepartment: ", selectedDepartment); // Debugging check
    } catch (error) {
      console.log("Error in setselected user ", error);
      toast.error(
        error.response?.data?.message || "Failed to get service window"
      );
    }
  },
}));
