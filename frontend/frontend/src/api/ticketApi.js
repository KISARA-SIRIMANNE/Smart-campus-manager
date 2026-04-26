import API from "./api";

export const getTickets = () => API.get("/tickets");
export const createTicket = (data) => API.post("/tickets", data);
export const updateTicketStatus = (id, status) =>
  API.put(`/tickets/${id}/status?status=${status}`);
export const rejectTicket = (id, reason) =>
  API.put(`/tickets/${id}/reject?reason=${encodeURIComponent(reason)}`);
export const assignTechnician = (id, technicianId, resolutionNotes) =>
  API.put(
    `/tickets/${id}/assign?technicianId=${technicianId}&resolutionNotes=${resolutionNotes}`
  );
export const getTicketCounts = () => API.get("/tickets/counts");