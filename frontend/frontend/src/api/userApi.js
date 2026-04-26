import API from "./api";

export const getAllUsers = () => API.get("/users");
export const getUserById = (id) => API.get(`/users/${id}`);
export const updateUserRole = (id, role) =>
  API.put(`/users/${id}/role`, { role });
export const deleteUser = (id) => API.delete(`/users/${id}`);
export const getUserStats = () => API.get("/users/stats/count");
