import API from "./api";

export const getBookings = () => API.get("/bookings");
export const createBooking = (data) => API.post("/bookings", data);
export const approveBooking = (id) => API.put(`/bookings/${id}/approve`);
export const rejectBooking = (id, reason) => API.put(`/bookings/${id}/reject`, {}, { params: { reason } });
export const cancelBooking = (id) => API.put(`/bookings/${id}/cancel`);
export const updateBooking = (id, data) => API.put(`/bookings/${id}`, data);
export const deleteBooking = (id) => API.delete(`/bookings/${id}`);
export const getBookingCounts = () => API.get("/bookings/counts");