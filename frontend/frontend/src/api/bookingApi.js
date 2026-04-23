import API from "./api";

export const getBookings = () => API.get("/bookings");
export const createBooking = (data) => API.post("/bookings", data);
export const approveBooking = (id) => API.put(`/bookings/${id}/approve`);
export const rejectBooking = (id) => API.put(`/bookings/${id}/reject`);
export const getBookingCounts = () => API.get("/bookings/counts");