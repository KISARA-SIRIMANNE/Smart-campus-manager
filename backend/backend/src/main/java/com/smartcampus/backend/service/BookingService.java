package com.smartcampus.backend.service;

import com.smartcampus.backend.entity.Booking;
import com.smartcampus.backend.repository.BookingRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;

    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    // CREATE BOOKING (with comprehensive validations)
    public Booking createBooking(Booking booking) {
        
        // Validate date and time
        validateBookingDateTime(booking);
        
        // Check for time conflicts
        validateTimeConflicts(booking);

        booking.setStatus("PENDING");
        return bookingRepository.save(booking);
    }
    
    // Validate date and time constraints
    private void validateBookingDateTime(Booking booking) {
        LocalDate currentDate = LocalDate.now();
        LocalTime currentTime = LocalTime.now();
        
        // Validate booking date is not in the past
        if (booking.getDate().isBefore(currentDate)) {
            throw new RuntimeException("Booking date cannot be in the past");
        }
        
        // If booking is for today, start time must be at least 1 hour from now
        if (booking.getDate().isEqual(currentDate)) {
            LocalTime minimumStartTime = currentTime.plusHours(1);
            if (booking.getStartTime().isBefore(minimumStartTime)) {
                throw new RuntimeException("Booking must be at least 1 hour in advance. Earliest available time: " + minimumStartTime);
            }
        }
        
        // Validate end time is after start time
        if (booking.getEndTime().isBefore(booking.getStartTime()) || 
            booking.getEndTime().equals(booking.getStartTime())) {
            throw new RuntimeException("End time must be after start time");
        }
        
        // Validate booking duration (minimum 30 minutes)
        long durationMinutes = java.time.temporal.ChronoUnit.MINUTES.between(
            booking.getStartTime(), 
            booking.getEndTime()
        );
        if (durationMinutes < 30) {
            throw new RuntimeException("Booking duration must be at least 30 minutes");
        }
        
        // Validate maximum booking duration (maximum 4 hours)
        if (durationMinutes > 240) {
            throw new RuntimeException("Booking duration cannot exceed 4 hours");
        }
    }
    
    // Check for time conflicts with existing bookings
    private void validateTimeConflicts(Booking booking) {
        // Get existing bookings for same resource + date (excluding rejected bookings)
        List<Booking> existingBookings =
                bookingRepository.findByResourceIdAndDate(
                        booking.getResourceId(),
                        booking.getDate()
                );

        // Check time overlap with approved/pending bookings only
        for (Booking existing : existingBookings) {
            
            // Skip rejected or cancelled bookings
            if (existing.getStatus() != null && 
                (existing.getStatus().equals("REJECTED") || existing.getStatus().equals("CANCELLED"))) {
                continue;
            }
            
            // Check if there's any time overlap
            boolean isOverlap =
                    booking.getStartTime().isBefore(existing.getEndTime()) &&
                            booking.getEndTime().isAfter(existing.getStartTime());

            if (isOverlap) {
                throw new RuntimeException(
                    "Time slot conflict! Resource already booked from " +
                    existing.getStartTime() + " to " + existing.getEndTime()
                );
            }
        }
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
    public Booking rejectBooking(String id, String reason) {
        Booking booking = bookingRepository.findById(id).orElse(null);

        if (booking != null) {
            booking.setStatus("REJECTED");
            booking.setRejectionReason(reason);
            return bookingRepository.save(booking);
        }

        return null;
    }

    // CANCEL BOOKING
    public Booking cancelBooking(String id) {
        Booking booking = bookingRepository.findById(id).orElse(null);

        if (booking == null) {
            throw new RuntimeException("Booking not found");
        }

        if (booking.getStatus() != null && !booking.getStatus().equals("APPROVED")) {
            throw new RuntimeException("Only APPROVED bookings can be cancelled");
        }

        booking.setStatus("CANCELLED");
        return bookingRepository.save(booking);
    }

    // UPDATE BOOKING
    public Booking updateBooking(String id, Booking bookingDetails) {
        Booking booking = bookingRepository.findById(id).orElse(null);
        
        if (booking == null) {
            throw new RuntimeException("Booking not found");
        }
        
        // Only allow editing if status is PENDING
        if (booking.getStatus() != null && !booking.getStatus().equals("PENDING")) {
            throw new RuntimeException("Can only edit bookings with PENDING status");
        }
        
        // Update only editable fields
        if (bookingDetails.getDate() != null) {
            booking.setDate(bookingDetails.getDate());
        }
        if (bookingDetails.getStartTime() != null) {
            booking.setStartTime(bookingDetails.getStartTime());
        }
        if (bookingDetails.getEndTime() != null) {
            booking.setEndTime(bookingDetails.getEndTime());
        }
        if (bookingDetails.getPurpose() != null) {
            booking.setPurpose(bookingDetails.getPurpose());
        }
        if (bookingDetails.getResourceId() != null) {
            booking.setResourceId(bookingDetails.getResourceId());
        }
        
        // Validate updated booking
        validateBookingDateTime(booking);
        validateTimeConflicts(booking);
        
        return bookingRepository.save(booking);
    }

    // DELETE
    public void deleteBooking(String id) {
        Booking booking = bookingRepository.findById(id).orElse(null);
        
        if (booking == null) {
            throw new RuntimeException("Booking not found");
        }
        
        // Only allow deletion if status is PENDING
        if (booking.getStatus() != null && !booking.getStatus().equals("PENDING")) {
            throw new RuntimeException("Can only delete bookings with PENDING status");
        }
        
        bookingRepository.deleteById(id);
    }
}