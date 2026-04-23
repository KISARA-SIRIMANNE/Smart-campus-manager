package com.smartcampus.backend.controller;

import com.smartcampus.backend.entity.Booking;
import com.smartcampus.backend.service.BookingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // CREATE BOOKING
    @PostMapping
    public Booking createBooking(@RequestBody Booking booking) {
        return bookingService.createBooking(booking);
    }

    // GET ALL BOOKINGS
    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    // GET BOOKING BY ID
    @GetMapping("/{id}")
    public Booking getBookingById(@PathVariable String id) {
        return bookingService.getBookingById(id);
    }

    // BOOKING DASHBOARD COUNTS
    @GetMapping("/counts")
    public Map<String, Long> getBookingCounts() {
        return bookingService.getBookingCounts();
    }

    // APPROVE BOOKING
    @PutMapping("/{id}/approve")
    public Booking approveBooking(@PathVariable String id) {
        return bookingService.approveBooking(id);
    }

    // REJECT BOOKING
    @PutMapping("/{id}/reject")
    public Booking rejectBooking(@PathVariable String id) {
        return bookingService.rejectBooking(id);
    }

    // DELETE BOOKING
    @DeleteMapping("/{id}")
    public void deleteBooking(@PathVariable String id) {
        bookingService.deleteBooking(id);
    }
}