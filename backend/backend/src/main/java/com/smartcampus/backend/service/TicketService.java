package com.smartcampus.backend.service;

import com.smartcampus.backend.entity.Ticket;
import com.smartcampus.backend.repository.TicketRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;

    public TicketService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    // CREATE
    public Ticket createTicket(Ticket ticket) {
        ticket.setStatus("OPEN");
        return ticketRepository.save(ticket);
    }

    // READ ALL
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    // READ BY ID
    public Ticket getTicketById(String id) {
        return ticketRepository.findById(id).orElse(null);
    }

    // FILTER BY STATUS
    public List<Ticket> getTicketsByStatus(String status) {
        return ticketRepository.findByStatus(status);
    }

    // FILTER BY INCIDENT TYPE
    public List<Ticket> getTicketsByIncidentType(String incidentType) {
        return ticketRepository.findByIncidentType(incidentType);
    }

    // FILTER BY PRIORITY
    public List<Ticket> getTicketsByPriority(String priority) {
        return ticketRepository.findByPriority(priority);
    }

    // DASHBOARD COUNTS
    public Map<String, Long> getTicketCounts() {
        Map<String, Long> counts = new HashMap<>();

        counts.put("TOTAL", ticketRepository.count());
        counts.put("OPEN", ticketRepository.countByStatus("OPEN"));
        counts.put("IN_PROGRESS", ticketRepository.countByStatus("IN_PROGRESS"));
        counts.put("RESOLVED", ticketRepository.countByStatus("RESOLVED"));
        counts.put("REJECTED", ticketRepository.countByStatus("REJECTED"));

        return counts;
    }

    // UPDATE STATUS
    public Ticket updateTicketStatus(String id, String status) {
        Ticket ticket = ticketRepository.findById(id).orElse(null);
        if (ticket != null) {
            ticket.setStatus(status);
            return ticketRepository.save(ticket);
        }
        return null;
    }

    // ASSIGN TECHNICIAN + ADD RESOLUTION
    public Ticket assignTechnicianAndResolution(String id, String technicianId, String resolutionNotes) {
        Ticket ticket = ticketRepository.findById(id).orElse(null);

        if (ticket != null) {
            ticket.setAssignedTechnicianId(technicianId);
            ticket.setResolutionNotes(resolutionNotes);

            // Auto move to IN_PROGRESS if not already resolved
            if (!"RESOLVED".equals(ticket.getStatus())) {
                ticket.setStatus("IN_PROGRESS");
            }

            return ticketRepository.save(ticket);
        }
        return null;
    }

    // REJECT TICKET
    public Ticket rejectTicket(String id, String reason) {
        Ticket ticket = ticketRepository.findById(id).orElse(null);
        if (ticket != null) {
            ticket.setStatus("REJECTED");
            ticket.setRejectionReason(reason);
            return ticketRepository.save(ticket);
        }
        return null;
    }

    // DELETE
    public void deleteTicket(String id) {
        ticketRepository.deleteById(id);
    }
}