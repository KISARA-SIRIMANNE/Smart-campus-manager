package com.smartcampus.backend.controller;

import com.smartcampus.backend.entity.Ticket;
import com.smartcampus.backend.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    // CREATE TICKET
    @PostMapping
    public Ticket createTicket(@Valid @RequestBody Ticket ticket) {
        return ticketService.createTicket(ticket);
    }

    // GET ALL TICKETS
    @GetMapping
    public List<Ticket> getAllTickets() {
        return ticketService.getAllTickets();
    }

    // GET TICKET BY ID
    @GetMapping("/{id}")
    public Ticket getTicketById(@PathVariable String id) {
        return ticketService.getTicketById(id);
    }

    // FILTER BY STATUS
    @GetMapping("/filter/status")
    public List<Ticket> getByStatus(@RequestParam String status) {
        return ticketService.getTicketsByStatus(status);
    }

    // FILTER BY CATEGORY
    @GetMapping("/filter/category")
    public List<Ticket> getByCategory(@RequestParam String category) {
        return ticketService.getTicketsByCategory(category);
    }

    // FILTER BY PRIORITY
    @GetMapping("/filter/priority")
    public List<Ticket> getByPriority(@RequestParam String priority) {
        return ticketService.getTicketsByPriority(priority);
    }

    // ✅ NEW: DASHBOARD COUNTS
    @GetMapping("/counts")
    public Map<String, Long> getTicketCounts() {
        return ticketService.getTicketCounts();
    }

    // UPDATE STATUS
    @PutMapping("/{id}/status")
    public Ticket updateStatus(@PathVariable String id,
                               @RequestParam String status) {
        return ticketService.updateTicketStatus(id, status);
    }

    // ASSIGN TECHNICIAN + ADD RESOLUTION
    @PutMapping("/{id}/assign")
    public Ticket assignTechnician(@PathVariable String id,
                                   @RequestParam String technicianId,
                                   @RequestParam String resolutionNotes) {
        return ticketService.assignTechnicianAndResolution(
                id, technicianId, resolutionNotes
        );
    }

    // DELETE TICKET
    @DeleteMapping("/{id}")
    public void deleteTicket(@PathVariable String id) {
        ticketService.deleteTicket(id);
    }
}