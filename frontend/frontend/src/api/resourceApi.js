import API from "./api";

export const getResources = () => API.get("/resources");
export const createResource = (data) => API.post("/resources", data);
export const deleteResource = (id) => API.delete(`/resources/${id}`);