import API from "./api";

export const getDashboardSummary = () => API.get("/admin/dashboard-summary");