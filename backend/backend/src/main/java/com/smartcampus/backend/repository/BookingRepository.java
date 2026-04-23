package com.smartcampus.backend.repository;

import com.smartcampus.backend.entity.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends MongoRepository<Booking, String> {

    // Find bookings for the same resource on the same date
    List<Booking> findByResourceIdAndDate(String resourceId, LocalDate date);

    long countByStatus(String status);
}