package com.smartcampus.backend.entity;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "tickets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ticket {

    @Id
    private String id;

    @NotBlank(message = "User ID is required")
    private String userId;

    private String location;

    @NotBlank(message = "Incident type is required")
    private String incidentType;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Priority is required")
    private String priority;

    private String preferredContact;

    private String status;
    private String rejectionReason;
    private String assignedTechnicianId;
    private String resolutionNotes;
}