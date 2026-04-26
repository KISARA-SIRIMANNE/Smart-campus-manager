import API from "./api";

export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const getUserProfile = (userId) => API.get(`/auth/profile/${userId}`);
export const updateUserProfile = (userId, data) => API.put(`/auth/profile/${userId}`, data);
export const uploadProfilePicture = (userId, pictureData) =>
  API.post(`/auth/profile/${userId}/picture`, { picture: pictureData });

export const loginUser = (data) => API.post("/auth/login", data);

export const googleLogin = (credential) =>
  API.post("/auth/google", { credential });
