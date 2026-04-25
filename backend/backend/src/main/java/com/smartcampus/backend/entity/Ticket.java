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

    @NotBlank(message = "Resource ID is required")
    private String resourceId;

    @NotBlank(message = "Category is required")
    @Pattern(
            regexp = "^[A-Z][a-zA-Z0-9 ]*$",
            message = "Category must start with a capital letter and contain only letters and numbers"
    )
    private String category;

    @NotBlank(message = "Description is required")
    @Pattern(
            regexp = "^[A-Z][a-zA-Z0-9 ,.]*$",
            message = "Description must start with a capital letter"
    )
    private String description;

    @NotBlank(message = "Priority is required")
    private String priority;

    @NotBlank(message = "Phone number is required")
    @Pattern(
            regexp = "^[0-9]{10}$",
            message = "Phone number must be exactly 10 digits"
    )
    private String preferredContact;

    private String status;
    private String assignedTechnicianId;
    private String resolutionNotes;
}