import API from "./api";

export const getResources = () => API.get("/resources");
export const createResource = (data) => API.post("/resources", data);
export const updateResource = (id, data) => API.put(`/resources/${id}`, data);
export const deleteResource = (id) => API.delete(`/resources/${id}`);
export const fixMissingCategories = (category = "Other") =>
  API.post(`/resources/fix/missingCategory?category=${category}`);