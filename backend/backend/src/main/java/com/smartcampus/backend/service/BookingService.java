package com.smartcampus.backend.service;

import com.smartcampus.backend.entity.Booking;
import com.smartcampus.backend.repository.BookingRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;

    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    // CREATE BOOKING (with conflict check)
    public Booking createBooking(Booking booking) {

        // Get existing bookings for same resource + date
        List<Booking> existingBookings =
                bookingRepository.findByResourceIdAndDate(
                        booking.getResourceId(),
                        booking.getDate()
                );

        // Check time overlap
        for (Booking existing : existingBookings) {

            boolean isOverlap =
                    booking.getStartTime().isBefore(existing.getEndTime()) &&
                            booking.getEndTime().isAfter(existing.getStartTime());

            if (isOverlap) {
                throw new RuntimeException("Time slot already booked!");
            }
        }

        booking.setStatus("PENDING");
        return bookingRepository.save(booking);
    }

    // GET ALL
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // GET BY ID
    public Booking getBookingById(String id) {
        return bookingRepository.findById(id).orElse(null);
    }

    // BOOKING DASHBOARD COUNTS
    public Map<String, Long> getBookingCounts() {
        Map<String, Long> counts = new HashMap<>();

        counts.put("TOTAL", bookingRepository.count());
        counts.put("PENDING", bookingRepository.countByStatus("PENDING"));
        counts.put("APPROVED", bookingRepository.countByStatus("APPROVED"));
        counts.put("REJECTED", bookingRepository.countByStatus("REJECTED"));

        return counts;
    }

    // APPROVE BOOKING
    public Booking approveBooking(String id) {
        Booking booking = bookingRepository.findById(id).orElse(null);

        if (booking != null) {
            booking.setStatus("APPROVED");
            return bookingRepository.save(booking);
        }

        return null;
    }

    // REJECT BOOKING
    public Booking rejectBooking(String id) {
        Booking booking = bookingRepository.findById(id).orElse(null);

        if (booking != null) {
            booking.setStatus("REJECTED");
            return bookingRepository.save(booking);
        }

        return null;
    }

    // DELETE
    public void deleteBooking(String id) {
        bookingRepository.deleteById(id);
    }
}