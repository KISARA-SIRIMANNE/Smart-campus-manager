package com.smartcampus.backend.service;

import com.smartcampus.backend.repository.BookingRepository;
import com.smartcampus.backend.repository.ResourceRepository;
import com.smartcampus.backend.repository.TicketRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AdminDashboardService {

    private final TicketRepository ticketRepository;
    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;

    public AdminDashboardService(TicketRepository ticketRepository,
                                 BookingRepository bookingRepository,
                                 ResourceRepository resourceRepository) {
        this.ticketRepository = ticketRepository;
        this.bookingRepository = bookingRepository;
        this.resourceRepository = resourceRepository;
    }

    public Map<String, Object> getDashboardSummary() {
        Map<String, Object> summary = new HashMap<>();

        Map<String, Long> ticketCounts = new HashMap<>();
        ticketCounts.put("TOTAL", ticketRepository.count());
        ticketCounts.put("OPEN", ticketRepository.countByStatus("OPEN"));
        ticketCounts.put("IN_PROGRESS", ticketRepository.countByStatus("IN_PROGRESS"));
        ticketCounts.put("RESOLVED", ticketRepository.countByStatus("RESOLVED"));
        ticketCounts.put("REJECTED", ticketRepository.countByStatus("REJECTED"));

        Map<String, Long> bookingCounts = new HashMap<>();
        bookingCounts.put("TOTAL", bookingRepository.count());
        bookingCounts.put("PENDING", bookingRepository.countByStatus("PENDING"));
        bookingCounts.put("APPROVED", bookingRepository.countByStatus("APPROVED"));
        bookingCounts.put("REJECTED", bookingRepository.countByStatus("REJECTED"));

        Map<String, Long> resourceCounts = new HashMap<>();
        resourceCounts.put("TOTAL", resourceRepository.count());

        summary.put("tickets", ticketCounts);
        summary.put("bookings", bookingCounts);
        summary.put("resources", resourceCounts);

        return summary;
    }
}