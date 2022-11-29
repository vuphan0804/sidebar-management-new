import axiosClient from "./axiosClient";

export const sidebarAPI = {
  getSidebars: async () => {
    return await axiosClient.get("/sidebarTree");
  },
  getLimitSidebar: async (page) => {
    return await axiosClient.get(`/sidebarTree?page=${page}&limit=30`);
  },
  getDetailSidebar: async (sidebarId) => {
    return await axiosClient.get(`/sidebarTree/${sidebarId}`);
  },
  addSidebar: async (payload) => {
    return await axiosClient.post("/sidebarTree", payload);
  },
  updateSidebar: async (sidebarId, payload) => {
    return await axiosClient.put(`/sidebarTree/${sidebarId}`, payload);
  },
  deleteSidebar: async (sidebarId) => {
    return await axiosClient.delete(`/sidebarTree/${sidebarId}`);
  },
};
