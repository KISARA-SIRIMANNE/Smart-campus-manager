package com.smartcampus.backend.repository;

import com.smartcampus.backend.entity.Ticket;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TicketRepository extends MongoRepository<Ticket, String> {

    // 🔍 Filter by status (OPEN, RESOLVED, etc.)
    List<Ticket> findByStatus(String status);

    // 🔍 Filter by incident type
    List<Ticket> findByIncidentType(String incidentType);

    // 🔍 Filter by priority
    List<Ticket> findByPriority(String priority);

    long countByStatus(String status);

}